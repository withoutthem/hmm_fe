import { Menu, MenuItem, styled, Typography } from '@mui/material';
import { ResetIcon } from '@shared/icons/ResetIcon';
import { ChatIcon } from '@shared/icons/ChatIcon';
import { HistoryIcon } from '@shared/icons/HistoryIcon';
import { FAQIcon } from '@shared/icons/FAQIcon';
import useUIStore, { BottomSheetType } from '@domains/common/ui/store/ui.store';
import useDialogStore, { DialogType } from '@domains/common/ui/store/dialog.store';
import { useTranslation } from 'react-i18next';

const GlobalMenu = () => {
  // ┣━━━━━━━━━━━━━━━━ GlobalHooks ━━━━━━━━━━━━━━━━┫
  const { t } = useTranslation();

  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━━━━━━━━┫
  const isMenuOpen = useUIStore((s) => s.isMenuOpen);
  const setIsMenuOpen = useUIStore((s) => s.setIsMenuOpen);
  const openDialog = useDialogStore((s) => s.openDialog);
  const setBottomSheetOpen = useUIStore((s) => s.setBottomSheetOpen);

  // ┣━━━━━━━━━━━━━━━━ Handlers ━━━━━━━━━━━━━━━━━━━┫
  const onClose = () => {
    setIsMenuOpen(null);
  };

  const onHistoryClick = () => {
    openDialog(DialogType.HISTORY);
    onClose();
  };

  const onPublisherCheck = () => {
    const el = document.getElementById('publish');
    if (el) el.style.display = 'flex';
    onClose();
  };

  const onOpenBottomSheet = () => {
    onClose();
    setBottomSheetOpen(BottomSheetType.LANGUAGE);
  };

  // ┣━━━━━━━━━━━━━━━━ Variables ━━━━━━━━━━━━━━━━━━┫
  const menuMap = [
    {
      icon: <ResetIcon />,
      label: t('globalMenu.toStart'),
      onClick: onClose,
    },
    {
      icon: <ChatIcon />,
      label: t('globalMenu.connectToAgent'),
      onClick: onClose,
    },
    {
      icon: <HistoryIcon />,
      label: t('globalMenu.chatHistory'),
      onClick: onHistoryClick,
    },
    {
      icon: <FAQIcon />,
      label: t('globalMenu.goToFAQ'),
      onClick: onClose,
    },
    {
      icon: <FAQIcon />,
      label: '퍼블리싱테스트보기',
      onClick: onPublisherCheck,
    },
    {
      icon: <FAQIcon />,
      label: 'bottomSheet.LANGUAGE',
      onClick: onOpenBottomSheet,
    },
  ];

  return (
    <StMenu anchorEl={isMenuOpen} open={Boolean(isMenuOpen)} onClose={onClose}>
      {menuMap.map((menu) => (
        <StMenuItem key={menu.label} onClick={menu.onClick}>
          {menu.icon}
          <Typography variant={'subtitle3Light'}>{menu.label}</Typography>
        </StMenuItem>
      ))}
    </StMenu>
  );
};

export default GlobalMenu;

const StMenu = styled(Menu)({
  '& .MuiPaper-root': {
    transform: 'translate(0px, -60px) !important',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 0px 0.5px rgba(0, 0, 0, 0.25), 0px 16px 60px rgba(0, 0, 0, 0.3)',

    '& ul': { padding: '8px 0' },
  },
});

const StMenuItem = styled(MenuItem)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  gap: '8px',
});
