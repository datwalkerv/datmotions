import { EditorClient } from '@/components/editor/EditorClient'

interface EditorPageProps {
  params: Promise<{ templateId: string }>
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { templateId } = await params
  return <EditorClient templateId={templateId} />
}
