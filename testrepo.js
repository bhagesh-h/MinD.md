const getRepo = async () => {
    let res = await fetch(`https://api.github.com/repos/bhagesh-h/test/git/trees/main?recursive=1`);
    console.log(await res.json());
}
getRepo();
