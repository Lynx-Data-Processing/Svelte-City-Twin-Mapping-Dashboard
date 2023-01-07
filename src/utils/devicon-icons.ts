export const getDevicon = (toolString: string) => {
    const options = [
        {
            search: ["original", "plain"],
            replace: ["-original", "-plain"],
            suffix: "-original-plain.svg",
        },
        {
            search: ["original", "line"],
            replace: ["-original", "-line"],
            suffix: "-original-line.svg",
        },
        {
            search: ["plain", "wordmark"],
            replace: ["-plain", "-wordmark"],
            suffix: "-plain-wordmark.svg",
        },
        {
            search: ["original", "wordmark"],
            replace: ["-original", "-wordmark"],
            suffix: "-original-wordmark.svg",
        },
        { search: ["line"], replace: ["-line"], suffix: "-line.svg" },
        { search: ["wordmark"], replace: ["-wordmark"], suffix: "-wordmark.svg" },
        { search: ["plain"], replace: ["-plain"], suffix: "-plain.svg" },
    ];

    let tempString = toolString;
    let suffix = "-original.svg";

    options.forEach(({ search, replace, suffix: s }) => {
        if (search.every((s) => tempString.includes(s))) {
            tempString = tempString.replace(replace[0], "").replace(replace[1], "");
            suffix = s;
        }
    });

    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tempString}/${tempString}${suffix}`;
};