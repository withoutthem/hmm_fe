import { Dialog, DialogActions, DialogContent, styled } from '@mui/material'
import useDialogStore from '@domains/common/ui/store/dialog.store'
import DialogRouter from '@domains/chatbot/components/dialog/DialogRouter'
import { FlexBox } from '@shared/ui/layoutUtilComponents'

const GlobalDialog = () => {
  const dialogOpen = useDialogStore((s) => s.open)
  const dialogType = useDialogStore((s) => s.type)
  const closeDialog = useDialogStore((s) => s.closeDialog)

  return (
    <StyledDialog open={dialogOpen} onClose={closeDialog} fullWidth hideBackdrop>
      <CloseButtonBox>
        <CloseButton onClick={closeDialog}>X</CloseButton>
      </CloseButtonBox>
      <DialogContent>
        <DialogRouter type={dialogType} />
      </DialogContent>
    </StyledDialog>
  )
}

export default GlobalDialog

const StyledDialog = styled(Dialog)({
  width: '100vw',
  height: '100vh',

  '& .MuiPaper-root': {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: '0',
    borderRadius: '0',
    boxShadow: 'none',
    overflow: 'hidden',
  },
})

const CloseButtonBox = styled(FlexBox)({
  justifyContent: 'flex-end',
})

const CloseButton = styled(DialogActions)({
  width: '48px',
  height: '48px',
  background: 'red',
  justifyContent: 'center',
  padding: '0',
})
