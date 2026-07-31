import ProfileCard from "../components/client/ProfileCard";

type ProfilePageProps = {
  id: string;
};

export default function ProfilePage({ id }: ProfilePageProps) {
  return (
    <section className="page-block">
      <h1>Profile</h1>
      <p className="lede narrow">
        Server page shell with a client island (<code>ProfileCard</code>) for local state.
      </p>
      <ProfileCard userId={id} />
    </section>
  );
}
