export const validateMachineName = (machineName) => {
  const validPattern = /^[a-z0-9_]+$/;
  return validPattern.test(machineName);
};

export const generateMachineNameFromLabel = (label) => {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Convert all non-alphanumeric and non-space characters to spaces
    .replace(/\s+/g, '_') // Replace one or more spaces with single underscore
    .replace(/^_+|_+$/g, ''); // Remove leading and trailing underscores
};