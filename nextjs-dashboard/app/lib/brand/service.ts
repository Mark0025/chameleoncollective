'use server';

import path from 'path';
import yaml from 'yaml';
import { getColorValue } from './colors';

const DEFAULT_COLORS = {
  primary: '#235082',
  secondary: '#FF6B6B',
  accent: '#4ECDC4',
  text: '#2C363F',
  background: '#FFFFFF',
  muted: '#F3F4F6',
};

export async function getBrandConfig() {
  try {
    // Use Next.js file system utilities for server-side file reading
    const { promises: fs } = require('fs');
    const filePath = path.join(process.cwd(), 'config', 'brand.yaml');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const config = yaml.parse(fileContents);

    // Ensure colors exist, fallback to defaults if not
    const colors = config.colors || DEFAULT_COLORS;

    return {
      ...config,
      colors: {
        primary: getColorValue(colors.primary || DEFAULT_COLORS.primary),
        secondary: getColorValue(colors.secondary || DEFAULT_COLORS.secondary),
        accent: getColorValue(colors.accent || DEFAULT_COLORS.accent),
        text: getColorValue(colors.text || DEFAULT_COLORS.text),
        background: getColorValue(colors.background || DEFAULT_COLORS.background),
        muted: getColorValue(colors.muted || DEFAULT_COLORS.muted),
      }
    };
  } catch (error) {
    console.error('Error loading brand config:', error);
    // Return default configuration if loading fails
    return {
      brand: {
        name: "Amanda's Party & Event Rentals",
        slogan: "Making Your Events Memorable",
        phone: { primary: "405-314-5387" }
      },
      colors: DEFAULT_COLORS
    };
  }
}
