export async function generateStaticParams() {
  // Generate the base route without parameters
  return [
    { docId: [] },
  ];
}

export default function CoverLetterEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}