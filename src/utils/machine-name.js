export const validateMachineName = (machineName) => {
  const validPattern = /^[a-z_]+$/;
  return validPattern.test(machineName);
};

export const generateMachineNameFromLabel = (label) => {
  return label.toLowerCase().replace(/\s+/g, '_');
};