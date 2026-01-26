/**
 * Shape Presets - Style variations for each shape type
 */

export const SHAPE_PRESETS = {
    // Header Badge variants
    'header-badge': {
        title: 'Header Badge',
        presets: [
            { name: 'Pill Right', style: { borderRadius: '20px 0 0 20px', width: '120px', height: '40px', right: '0', left: 'auto' } },
            { name: 'Pill Left', style: { borderRadius: '0 20px 20px 0', width: '120px', height: '40px', left: '0', right: 'auto' } },
            { name: 'Tag Right', style: { borderRadius: '4px 0 0 4px', width: '100px', height: '32px', right: '0', left: 'auto' } },
            { name: 'Banner', style: { borderRadius: '0', width: '200px', height: '36px', right: '0', left: 'auto' } },
            { name: 'Circle', style: { borderRadius: '50%', width: '60px', height: '60px', right: '20px', left: 'auto' } },
            { name: 'Diamond', style: { borderRadius: '0', width: '50px', height: '50px', transform: 'rotate(45deg)', right: '30px', left: 'auto' } },
        ]
    },
    // Top Line variants
    'top-line': {
        title: 'Top Line',
        presets: [
            { name: 'Center', style: { left: '60px', right: '60px', width: 'auto', height: '3px' } },
            { name: 'Full', style: { left: '0', right: '0', width: 'auto', height: '3px' } },
            { name: 'Left Half', style: { left: '0', right: 'auto', width: '50%', height: '3px' } },
            { name: 'Thick', style: { left: '60px', right: '60px', width: 'auto', height: '6px' } },
            { name: 'Accent', style: { left: '60px', right: 'auto', width: '120px', height: '4px', borderRadius: '2px' } },
        ]
    },
    // Top Bar variants
    'top-bar': {
        title: 'Top Bar',
        presets: [
            { name: 'Thin', style: { height: '8px' } },
            { name: 'Medium', style: { height: '12px' } },
            { name: 'Thick', style: { height: '20px' } },
            { name: 'Bold', style: { height: '40px' } },
        ]
    },
    // Side Bar variants
    'side-bar': {
        title: 'Side Bar',
        presets: [
            { name: 'Thin', style: { width: '4px' } },
            { name: 'Medium', style: { width: '8px' } },
            { name: 'Wide', style: { width: '16px' } },
            { name: 'Accent', style: { width: '6px', top: '20%', height: '60%', borderRadius: '0 3px 3px 0' } },
        ]
    },
    // Left Stripe variants
    'left-stripe': {
        title: 'Left Stripe',
        presets: [
            { name: 'Narrow', style: { width: '30px' } },
            { name: 'Medium', style: { width: '40px' } },
            { name: 'Wide', style: { width: '60px' } },
            { name: 'Panel', style: { width: '100px' } },
        ]
    },
    // Bottom Strip variants
    'bottom-strip': {
        title: 'Bottom Strip',
        presets: [
            { name: 'Thin', style: { height: '4px' } },
            { name: 'Medium', style: { height: '6px' } },
            { name: 'Thick', style: { height: '10px' } },
            { name: 'Bold', style: { height: '20px' } },
        ]
    },
    // Corner variants
    'corner-accent': {
        title: 'Corner TL',
        presets: [
            { name: 'Small', style: { borderLeftWidth: '50px', borderBottomWidth: '50px' } },
            { name: 'Medium', style: { borderLeftWidth: '80px', borderBottomWidth: '80px' } },
            { name: 'Large', style: { borderLeftWidth: '120px', borderBottomWidth: '120px' } },
            { name: 'Huge', style: { borderLeftWidth: '200px', borderBottomWidth: '200px' } },
        ]
    },
    'corner-tr': {
        title: 'Corner TR',
        presets: [
            { name: 'Small', style: { borderRightWidth: '50px', borderBottomWidth: '50px' } },
            { name: 'Medium', style: { borderRightWidth: '80px', borderBottomWidth: '80px' } },
            { name: 'Large', style: { borderRightWidth: '120px', borderBottomWidth: '120px' } },
        ]
    },
    'corner-bl': {
        title: 'Corner BL',
        presets: [
            { name: 'Small', style: { borderLeftWidth: '50px', borderTopWidth: '50px' } },
            { name: 'Medium', style: { borderLeftWidth: '80px', borderTopWidth: '80px' } },
            { name: 'Large', style: { borderLeftWidth: '120px', borderTopWidth: '120px' } },
        ]
    },
    'corner-br': {
        title: 'Corner BR',
        presets: [
            { name: 'Small', style: { borderRightWidth: '50px', borderTopWidth: '50px' } },
            { name: 'Medium', style: { borderRightWidth: '80px', borderTopWidth: '80px' } },
            { name: 'Large', style: { borderRightWidth: '120px', borderTopWidth: '120px' } },
        ]
    },
    'corner-dots': {
        title: 'Corner Dots',
        presets: [
            { name: 'Small', style: { width: '40px', height: '40px', backgroundSize: '8px 8px' } },
            { name: 'Medium', style: { width: '60px', height: '60px', backgroundSize: '10px 10px' } },
            { name: 'Large', style: { width: '100px', height: '100px', backgroundSize: '12px 12px' } },
            { name: 'Dense', style: { width: '80px', height: '80px', backgroundSize: '6px 6px' } },
        ]
    },
    // Title underline variants
    'title-underline': {
        title: 'Title Underline',
        presets: [
            { name: 'Short', style: { width: '60px', height: '3px' } },
            { name: 'Medium', style: { width: '80px', height: '4px' } },
            { name: 'Long', style: { width: '150px', height: '3px' } },
            { name: 'Thick', style: { width: '100px', height: '6px' } },
            { name: 'Pill', style: { width: '80px', height: '8px', borderRadius: '4px' } },
        ]
    },
    // Accent Circle variants
    'accent-circle': {
        title: 'Accent Circle',
        presets: [
            { name: 'Small', style: { width: '120px', height: '120px', right: '-40px' } },
            { name: 'Medium', style: { width: '200px', height: '200px', right: '-60px' } },
            { name: 'Large', style: { width: '300px', height: '300px', right: '-100px' } },
            { name: 'Huge', style: { width: '400px', height: '400px', right: '-150px' } },
            { name: 'Half', style: { width: '300px', height: '300px', right: '-150px' } },
        ]
    },
    // Logo Area variants
    'logo-area': {
        title: 'Logo Area',
        presets: [
            { name: 'Small', style: { width: '60px', height: '30px' } },
            { name: 'Medium', style: { width: '80px', height: '40px' } },
            { name: 'Large', style: { width: '120px', height: '60px' } },
            { name: 'Square', style: { width: '50px', height: '50px' } },
            { name: 'Wide', style: { width: '150px', height: '40px' } },
        ]
    },
    // Watermark variants
    'watermark': {
        title: 'Watermark',
        presets: [
            { name: 'Small', style: { fontSize: '80px' } },
            { name: 'Medium', style: { fontSize: '120px' } },
            { name: 'Large', style: { fontSize: '180px' } },
            { name: 'Subtle', style: { fontSize: '120px', opacity: '0.08' } },
            { name: 'Bold', style: { fontSize: '120px', opacity: '0.25' } },
        ]
    },
    // Section Divider variants
    'section-divider': {
        title: 'Section Divider',
        presets: [
            { name: 'Full', style: { left: '5%', right: '5%' } },
            { name: 'Center', style: { left: '20%', right: '20%' } },
            { name: 'Short', style: { left: '35%', right: '35%' } },
            { name: 'Thick', style: { left: '10%', right: '10%', height: '2px' } },
        ]
    },
    // BG Pattern variants
    'bg-pattern': {
        title: 'BG Pattern',
        presets: [
            { name: 'Fine', style: { backgroundSize: '15px 15px', opacity: '0.2' } },
            { name: 'Medium', style: { backgroundSize: '20px 20px', opacity: '0.3' } },
            { name: 'Coarse', style: { backgroundSize: '30px 30px', opacity: '0.25' } },
            { name: 'Dense', style: { backgroundSize: '10px 10px', opacity: '0.15' } },
        ]
    },
};

// ============================================================================
