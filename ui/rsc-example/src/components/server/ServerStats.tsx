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
    <ul>
      <li>Active users: {stats.users}</li>
      <li>Active sessions: {stats.sessions}</li>
      <li>Build: {stats.build}</li>
    </ul>
  );
}
