interface PlaceholderPageProps {
  title: string;
}

/**
 * Temporary stand-in for a real page. Every route below renders this with
 * a different title so the routing tree can be wired up and tested before
 * any actual page UI is built.
 */
export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <p>{title} — page not yet implemented.</p>
    </div>
  );
}
