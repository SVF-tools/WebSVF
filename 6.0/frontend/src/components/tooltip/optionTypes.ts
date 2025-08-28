// optionTypes.ts - Updated with toolType utility

export interface OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

export interface CompileOption extends OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

export interface ExecutableOption extends OptionWithDescription {
  value: string;
  label: string;
  description?: string;
}

export function addDescriptionsToOptions<T extends { value: string; label: string }>(
  options: T[],
  descriptions: Record<string, string>
): (T & { description?: string })[] {
  return options.map((option) => ({
    ...option,
    description: descriptions[option.value] || undefined,
  }));
}

// Utility function to determine tool type from executable name
export const getToolType = (
  executableName: string
): 'mta' | 'saber' | 'ae' | 'wpa' | 'cfl' | 'dvf' | undefined => {
  if (!executableName) return undefined;

  const name = executableName.toLowerCase();
  if (name.includes('mta') || name.includes('multi-thread')) return 'mta';
  if (name.includes('saber')) return 'saber';
  if (name.includes('ae') || name.includes('abstract')) return 'ae';
  if (name.includes('null-deref')) return 'ae';
  // Updated checks:
  if (name.includes('wpa') || name.includes('pointer analysis')) return 'wpa';
  if (name.includes('cfl') || name.includes('reachability')) return 'cfl';
  if (name.includes('dvf') || name.includes('on-demand') || name.includes('value flow'))
    return 'dvf';

  return undefined;
};
