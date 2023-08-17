export const getInitials = (name: string) => {
  return name
    .toUpperCase()
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('');
};
