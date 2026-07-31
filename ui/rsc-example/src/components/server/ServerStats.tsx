async function loadStats() {
  await new Promise((resolve) => setTimeout(resolve, 180));
  return {
    users: 128,
    sessions: 42,
    build: "rsc-ssr",
  };
}

export default async function ServerStats() {
  const stats = await loadStats();
  return (
    <ul className="stat-grid">
      <li>
        <span>Users</span>
        <strong>{stats.users}</strong>
      </li>
      <li>
        <span>Sessions</span>
        <strong>{stats.sessions}</strong>
      </li>
      <li>
        <span>Build</span>
        <strong>{stats.build}</strong>
      </li>
    </ul>
  );
}
