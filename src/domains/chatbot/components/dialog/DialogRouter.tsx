import HistoryDialog from '@domains/chatbot/components/dialog/components/HistoryDialog'

const DialogRouter = ({ type }: { type: string | null }) => {
  if (type === 'history') return <HistoryDialog />
  return null
}

export default DialogRouter
