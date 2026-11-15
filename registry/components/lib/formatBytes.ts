const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === null || bytes === undefined) {
    return 'N/A'; // Handle null/undefined input
  }

  if (!+bytes) {
    return '0 Bytes'; // Handle 0 or falsy input
  }

  const base = 1024; // Base for binary units (KiB, MiB, GiB)
  const dm = decimals < 0 ? 0 : decimals; // Ensure decimals is not negative
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']; // Units array

  // Calculate the appropriate unit index
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

  // Format the size and append the unit
  const formattedSize = (bytes / Math.pow(base, unitIndex)).toFixed(dm);

  return `${parseFloat(formattedSize)} ${units[unitIndex]}`;
};

export { formatBytes };
