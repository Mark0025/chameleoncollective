const brandConfig = {
  brand: {
    name: "Amanda's Party & Event Rentals",
    slogan: "Making Your Events Memorable",
    phone: { primary: "405-314-5387" }
  },
  colors: {
    primary: '#235082',    // Tiger blue
    secondary: '#FF6B6B',  // Pink
    accent: '#4ECDC4',     // Accent blue
    text: '#2C363F',       // Dark text
    background: '#FFFFFF', // White
    muted: '#F3F4F6'      // Light gray
  }
}

// Static config that can be used on both client and server
export function getBrandConfig() {
  return brandConfig
}
