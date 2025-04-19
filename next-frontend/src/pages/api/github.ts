import { getRepos } from '@/lib/github';
import { NextApiRequest, NextApiResponse } from 'next';

// Your GitHub OAuth App credentials
const CLIENT_ID = 'Ov23livl0mmy0KYKZs28';
const CLIENT_SECRET = '0744745b5c144f7f236b09bd509f9eb7243056ad'; // Replace with your actual client secret

export default async function getAccessToken(req: NextApiRequest, res: NextApiResponse) {
  // Log the received code for debugging
  console.log(req.query.code);
  
  if (!req.query.code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }
  
  try {
    // Build the params string for the request to GitHub
    const params = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`;
    
    // Make request to GitHub OAuth token endpoint
    const response = await fetch(`https://github.com/login/oauth/access_token?${params}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-OAuth-Scopes': 'repo, user',
        'X-Accepted-OAuth-Scopes': 'repo, user'
      }
    });
    
    // Parse the JSON response
    const data = await response.json();
    console.log(data);

	// const repos = await getRepos(data.access_token);
	// console.log(repos);

    
    // Return the token data to the client
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return res.status(500).json({ error: 'Failed to exchange authorization code for token' });
  }
}
