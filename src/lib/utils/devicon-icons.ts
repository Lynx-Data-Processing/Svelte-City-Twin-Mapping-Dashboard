export const getDevicon = (toolString: string) => {
    const BASE_URL = toolString.includes("github")
      ? 'https://raw.githubusercontent.com/devicons/devicon/develop/icons'
      : 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
  
    const matchSuffix = toolString.match(/-(wordmark|plain|original)/);
    const suffix = matchSuffix ? matchSuffix[0] : '-original';
    const icon = toolString.replace(/-(original|plain|wordmark|github)/g, '');
  
    return `${BASE_URL}/${icon}/${icon}${suffix}.svg`;
  };
  