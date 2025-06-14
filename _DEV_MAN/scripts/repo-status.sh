#!/usr/bin/env bash

# Strict mode for robust error handling and debugging
set -Eeuo pipefail

# Trap errors with detailed error reporting
trap 'handle_error "$BASH_COMMAND" "$?"' ERR

# Error handling function
handle_error() {
    local command="$1"
    local exit_code="$2"
    echo "❌ Error: Command '$command' failed with exit code $exit_code" >&2
    exit "$exit_code"
}

# Logging function
log() {
    local level="${1^^}"
    local message="$2"
    local timestamp
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    case "$level" in
        INFO)
            echo "[INFO] $timestamp - $message"
            ;;
        WARN)
            echo "[WARN] $timestamp - $message" >&2
            ;;
        ERROR)
            echo "[ERROR] $timestamp - $message" >&2
            ;;
        *)
            echo "[LOG] $timestamp - $message"
            ;;
    esac
}

# Configuration
readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly SCRIPT_NAME=$(basename "$0")
readonly TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Directories
readonly OUTPUT_DIR="${ROOT_DIR}/_DEV_MAN/scripts/output"
readonly LOG_DIR="${ROOT_DIR}/_DEV_MAN/logs"

# Create necessary directories
mkdir -p "$OUTPUT_DIR" "$LOG_DIR"

# Output files
readonly OUTPUT_FILE="${OUTPUT_DIR}/repo_status_${TIMESTAMP}.md"
readonly MERMAID_FILE="${OUTPUT_DIR}/repo_status_${TIMESTAMP}.mmd"
readonly LOG_FILE="${LOG_DIR}/repo_status_${TIMESTAMP}.log"

# Color codes (for potential terminal output)
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Validate dependencies
validate_dependencies() {
    local dependencies=("git" "grep" "sed" "awk")
    local missing_deps=()

    for cmd in "${dependencies[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_deps+=("$cmd")
        fi
    done

    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log ERROR "Missing required dependencies: ${missing_deps[*]}"
        exit 1
    fi
}

# Safe append function with error checking
safe_append() {
    local content="$1"
    if [[ -n "$content" ]]; then
        printf '%s\n' "$content" >> "$OUTPUT_FILE" || {
            log ERROR "Failed to append content to $OUTPUT_FILE"
            return 1
        }
    fi
}

# Generate Mermaid diagram header
generate_mermaid_header() {
    printf "graph TD\n" > "$MERMAID_FILE"
    printf "    classDef main fill:#f9f,stroke:#333,stroke-width:4px;\n" >> "$MERMAID_FILE"
    printf "    classDef branch fill:#bbf,stroke:#333,stroke-width:2px;\n" >> "$MERMAID_FILE"
    printf "    classDef remote fill:#bfb,stroke:#333,stroke-width:2px;\n" >> "$MERMAID_FILE"
}

# Analyze branch differences
analyze_branch_differences() {
    local repo_path="$1"
    local repo_name="$2"

    # Change to repository directory
    cd "$repo_path" || { log ERROR "Cannot change to directory $repo_path"; return 1; }

    # Local branches analysis
    safe_append "### 🌿 Local Branches"
    local local_branches_raw
    local_branches_raw=$(git branch -a | grep -E "^\\s*[*]?\\s*" | grep -v "remotes/" || true)
    safe_append "**Total Local Branches:** $(echo "$local_branches_raw" | wc -l | tr -d ' ')"
    
    if [[ -n "$local_branches_raw" ]]; then
        safe_append "\`\`\`"
        printf '%s\n' "$local_branches_raw" >> "$OUTPUT_FILE"
        safe_append "\`\`\`"
    fi

    # Remote branches analysis
    safe_append "### 🌐 Remote Branches"
    local remote_branches_raw
    remote_branches_raw=$(git branch -r || true)
    safe_append "**Total Remote Branches:** $(echo "$remote_branches_raw" | wc -l | tr -d ' ')"
    
    if [[ -n "$remote_branches_raw" ]]; then
        safe_append "\`\`\`"
        printf '%s\n' "$remote_branches_raw" >> "$OUTPUT_FILE"
        safe_append "\`\`\`"
    fi

    # Untracked remote branches
    safe_append "### 🕵️ Untracked Remote Branches"
    local untracked_branches_raw
    untracked_branches_raw=$(git branch -r --format='%(refname:short)' | grep -v -E "(HEAD|main|master|production|dev)" | while read -r remote_branch; do
        if ! git branch --list "${remote_branch#*/}" > /dev/null 2>&1; then
            echo "$remote_branch"
        fi
    done || true)
    
    if [[ -n "$untracked_branches_raw" ]]; then
        safe_append "⚠️ **Branches not tracked locally:**"
        safe_append "\`\`\`"
        printf '%s\n' "$untracked_branches_raw" >> "$OUTPUT_FILE"
        safe_append "\`\`\`"
    else
        safe_append "✓ **All remote branches are tracked locally**"
    fi

    # Branch divergence analysis
    safe_append "### 🔀 Branch Divergence Analysis"
    git for-each-ref --format="%(refname:short) %(upstream:short)" refs/heads | while read -r local remote; do
        if [[ -n "$remote" ]]; then
            local ahead behind
            ahead=$(git rev-list "$local" --not "$remote" --count)
            behind=$(git rev-list "$remote" --not "$local" --count)
            
            if [[ "$ahead" -gt 0 ]] || [[ "$behind" -gt 0 ]]; then
                safe_append "- **$local** vs **$remote**:"
                if [[ "$ahead" -gt 0 ]]; then
                    safe_append "  - 🚀 **$ahead** commit(s) ahead of remote"
                fi
                if [[ "$behind" -gt 0 ]]; then
                    safe_append "  - 🔙 **$behind** commit(s) behind remote"
                fi
            fi
        fi
    done || true

    # Stash analysis
    safe_append "### 🗃️ Stash Status"
    local stash_count
    stash_count=$(git stash list | wc -l | tr -d ' ')
    if [[ "$stash_count" -gt 0 ]]; then
        safe_append "⚠️ **Stashed Changes:** $stash_count"
        safe_append "\`\`\`"
        git stash list >> "$OUTPUT_FILE" || true
        safe_append "\`\`\`"
    else
        safe_append "✓ **No stashed changes**"
    fi
}

# Function to generate colorful git tree
generate_git_tree() {
    local repo_path="$1"
    local output_file="$2"
    
    # Change to repository directory
    cd "$repo_path" || { log ERROR "Cannot change to directory $repo_path"; return 1; }
    
    # Colorful git log with graph
    local git_tree_output
    git_tree_output=$(git log --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit --date=relative -n 30)
    
    # Append to output file
    safe_append "## 🌳 Git Commit Tree"
    safe_append "\`\`\`ansi"
    printf '%s\n' "$git_tree_output" >> "$output_file"
    safe_append "\`\`\`"
    
    # Optional: Generate a more detailed Mermaid graph representation
    generate_mermaid_git_tree "$repo_path" "$output_file"
}

# Function to generate Mermaid git tree representation
generate_mermaid_git_tree() {
    local repo_path="$1"
    local output_file="$2"
    
    # Change to repository directory
    cd "$repo_path" || { log ERROR "Cannot change to directory $repo_path"; return 1; }
    
    # Get commit information for Mermaid graph
    local commits
    commits=$(git log --pretty=format:"%h|%s|%an" -n 10)
    
    # Start Mermaid graph
    {
        echo "graph TD"
        echo "    classDef commit fill:#f9f,stroke:#333,stroke-width:2px;"
        
        # Process commits and create Mermaid nodes
        echo "$commits" | while IFS='|' read -r hash message author; do
            # Sanitize message and author for Mermaid
            message=$(echo "${message}" | sed 's/["\]//g')
            author=$(echo "${author}" | sed 's/["\]//g')
            
            echo "    ${hash}[\"${hash}: ${message}<br/>by ${author}\"]:::commit"
        done
        
        # Create links between commits (simplified)
        echo "$commits" | awk -F'|' 'NR>1{print "    " prev_hash " --> " $1}' prev_hash="$(echo "$commits" | head -n1 | cut -d'|' -f1)"
    } > "$MERMAID_FILE"
    
    # Append Mermaid graph reference to output
    safe_append "### 🔗 Commit Relationship Diagram"
    safe_append "*(See Mermaid diagram at ${MERMAID_FILE#$ROOT_DIR/})*"
}

# Analyze repository status
analyze_repo() {
    local repo_path="$1"
    local repo_name
    repo_name=$(basename "$repo_path")

    # Change to repository directory
    cd "$repo_path" || { log ERROR "Cannot change to directory $repo_path"; return 1; }

    # Repository summary
    safe_append "# 📁 Repository: $repo_name"

    # Current branch
    local current_branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    safe_append "## 🌳 Current Branch: \`$current_branch\`"

    # Uncommitted changes
    local status_output_raw
    status_output_raw=$(git status -s || true)
    if [[ -n "$status_output_raw" ]]; then
        safe_append "### ⚠️ Uncommitted Changes"
        safe_append "**Status:**"
        safe_append "\`\`\`"
        printf '%s\n' "$status_output_raw" >> "$OUTPUT_FILE"
        safe_append "\`\`\`"

        # Detailed diff
        local diff_output_raw
        diff_output_raw=$(git diff --unified=0 || true)
        safe_append "**Detailed Changes:**"
        safe_append "\`\`\`diff"
        printf '%s\n' "$diff_output_raw" >> "$OUTPUT_FILE"
        safe_append "\`\`\`"
    else
        safe_append "### ✓ Working directory clean"
    fi

    # Remote repositories
    safe_append "## 🌐 Remote Repositories"
    local remotes_raw
    remotes_raw=$(git remote -v || true)
    safe_append "**Total Remotes:** $(echo "$remotes_raw" | wc -l | tr -d ' ')"
    if [[ -n "$remotes_raw" ]]; then
        safe_append "\`\`\`"
        printf '%s\n' "$remotes_raw" >> "$OUTPUT_FILE"
        safe_append "\`\`\`"
    fi

    # Commit history
    safe_append "## 📜 Recent Commit History"
    git log --pretty=format:'- **%h** %ad | %s - %an' --date=short -n 10 >> "$OUTPUT_FILE" || true

    # Branch analysis
    analyze_branch_differences "$repo_path" "$repo_name"

    # Add git tree visualization after branch analysis
    generate_git_tree "$repo_path" "$OUTPUT_FILE"

    # Separator
    safe_append ""
    safe_append "---"
    safe_append ""
}

# Main repository analysis function
analyze_repositories() {
    # Validate system dependencies
    validate_dependencies

    # Start output file
    printf "# 🔍 Comprehensive Repository Status Analysis\n" > "$OUTPUT_FILE"
    printf "## Generated on %s\n" "$(date)" >> "$OUTPUT_FILE"
    printf "## 📊 Overview\n\n" >> "$OUTPUT_FILE"

    # Find and analyze repositories
    local repo_count=0
    while IFS= read -r repo; do
        local repo_path
        repo_path=$(dirname "$repo")
        analyze_repo "$repo_path"
        ((repo_count++))
    done < <(find "$ROOT_DIR" -type d -name ".git")

    # Final summary
    printf "## 🚀 Key Observations\n" >> "$OUTPUT_FILE"
    printf "- Total Repositories Analyzed: **%s**\n" "$repo_count" >> "$OUTPUT_FILE"
    printf "- Active development across multiple repositories\n" >> "$OUTPUT_FILE"
    printf "- Ongoing project restructuring and workflow optimization\n" >> "$OUTPUT_FILE"
    printf "- Multiple branches indicating parallel development efforts\n" >> "$OUTPUT_FILE"

    log INFO "Repository analysis complete. Output saved to $OUTPUT_FILE"
}

# Script entry point
main() {
    # Redirect all output to log file
    exec > >(tee -a "$LOG_FILE") 2>&1

    # Run analysis
    analyze_repositories

    # Optional: Generate Mermaid diagram
    generate_mermaid_header
}

# Execute main function
main 