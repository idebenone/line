"use client";
import { Button } from "../ui/button";

/**
 * TODO
 * List top 3 Repositories based on contribution activity
 * Display name, stars and forks - highlight contributions
 * a small chart would be nice
 */

export default function TopRepositories() {
  async function getTopRepositories() {
    const reposResponse = await fetch(
      `https://api.github.com/users/idebenone/repos?sort=updated&per_page=100`
    );
    const repos = await reposResponse.json();

    // Fetch contribution stats for each repo
    const reposWithContributions = await Promise.all(
      repos.map(async (repo) => {
        const statsResponse = await fetch(
          `https://api.github.com/repos/idebenone/${repo.name}/stats/participation`
        );
        const stats = await statsResponse.json();

        // Calculate total contributions
        const totalContributions = stats.all.reduce((acc, val) => acc + val, 0);
        return { repo: repo.name, contributions: totalContributions };
      })
    );

    const topRepos = reposWithContributions
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 3);

    console.log(topRepos);
  }
  return (
    <div className="w-1/3 h-full">
      <p>Your Top Repositories</p>

      <Button onClick={getTopRepositories}>Test</Button>
    </div>
  );
}
