import { Box, styled } from '@mui/material';
import useUIStore, { ModalType } from '@domains/common/ui/store/ui.store';
import TestAlert from '@domains/chatbot/components/modal/components/TestAlert';
import TestConfirm from '@domains/chatbot/components/modal/components/TestConfirm';
import TestHeaderConfirm from '@domains/chatbot/components/modal/components/TestHeaderConfirm';

const GlobalModal = () => {
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const modalType = useUIStore((state) => state.modalType);
  const setModalClose = useUIStore((state) => state.setModalClose);

  if (!isModalOpen) return null;
  return (
    <StModalWrap onClick={setModalClose}>
      {modalType === ModalType.TESTALERT && <TestAlert />}
      {modalType === ModalType.TESTCONFIRM && <TestConfirm />}
      {modalType === ModalType.TESTHEADERCONFIRM && <TestHeaderConfirm />}
    </StModalWrap>
  );
};

export default GlobalModal;

const StModalWrap = styled(Box)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  height: '100%',
  background: '#0000008C',
  zIndex: '2000',
}));
