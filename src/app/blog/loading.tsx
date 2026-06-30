import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="container-page py-10">
      <Spinner label="Loading articles…" />
    </div>
  );
}
