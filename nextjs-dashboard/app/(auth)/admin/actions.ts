'use server'

import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import yaml from 'js-yaml'
import { revalidatePath } from 'next/cache'

export type State = {
  message: string | null
  error: string | null
}

function formDataToNestedObject(formData: FormData) {
  const result: any = {}
  
  for (const [key, value] of formData.entries()) {
    const keys = key.split('.')
    let current = result
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value || ''
  }
  
  return result
}

export async function updateConfig(prevState: State, formData: FormData): Promise<State> {
  try {
    // Convert form data to nested object structure
    const newData = formDataToNestedObject(formData)
    
    // Convert to YAML and write to file
    const yamlStr = yaml.dump(newData, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    })

    console.log('Writing new config:', newData) // Debug log
    
    await writeFile(
      join(process.cwd(), 'config/brand.yaml'),
      yamlStr,
      'utf8'
    )
    
    // Force revalidation of all pages that might use this config
    revalidatePath('/')
    revalidatePath('/admin/settings')
    
    return { message: 'Settings updated successfully', error: null }
  } catch (error) {
    console.error('Error updating settings:', error)
    return { message: null, error: 'Failed to update settings. Please try again.' }
  }
}

export async function getBrandConfig() {
  try {
    const yamlStr = await readFile(
      join(process.cwd(), 'config/brand.yaml'),
      'utf8'
    )
    const data = yaml.load(yamlStr)
    console.log('Loaded config:', data) // Debug log
    return { data, error: null }
  } catch (error) {
    console.error('Error reading settings:', error)
    return { data: null, error: 'Failed to read settings' }
  }
} 