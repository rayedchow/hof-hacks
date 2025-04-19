import { Octokit } from "octokit";

export const getRepos = async (token: string) => {
	const octokit = new Octokit({
		auth: token
	})
	  
	const { data } = await octokit.request('GET /user/repos', {
		headers: {
		  'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	for(const repo of data) {
		const readmeData = await getREADME(octokit, repo.owner.login, repo.name);
		const readmeContent = Buffer.from(readmeData.content, readmeData.encoding).toString();
		console.log(readmeContent);
	}

	return data;
};

export const getREADME = async (octokit: Octokit, owner: string, repo: string) => {
	const { data } = await octokit.request(`GET /repos/${owner}/${repo}/readme`, {
		owner, repo,
		headers: {
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});
	return data;
};