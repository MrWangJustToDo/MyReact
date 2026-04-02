import ProfileCard from "../components/client/ProfileCard";

type ProfilePageProps = {
  id: string;
};

export default function ProfilePage({ id }: ProfilePageProps) {
  return (
    <div className="page">
      <h1>Profile</h1>
      <p className="muted">Client-only card rendered inside a server page.</p>
      <div className="card">
        <ProfileCard userId={id} />
      </div>
    </div>
  );
}
