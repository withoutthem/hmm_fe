import { Drawer, List, ListItem, styled, Typography, Button } from '@mui/material';
import useUIStore from '@domains/common/ui/store/ui.store';
import { ColumnBox } from '@shared/ui/layoutUtilComponents';
// eslint-disable no-warning-comments - 화면이 넓이지면 필요할수도 있어서 주석처리
// import { CloseWIcon } from '@shared/icons/CloseWIcon';
import { BookingIcon } from '@shared/icons/BookingIcon';
import { InvoiceIcon } from '@shared/icons/InvoiceIcon';
import { LocationIcon } from '@shared/icons/LocationIcon';
import { PersonSerachIcon } from '@shared/icons/PersonSerachIcon';
import { RequestQuoteIcon } from '@shared/icons/RequestQuoteIcon';
import { ScheduleIcon } from '@shared/icons/ScheduleIcon';
import { SerchargeIcon } from '@shared/icons/SerchargeIcon';
import { WarningAmberIcon } from '@shared/icons/WarningAmberIcon';
import React, { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

enum MenuGroup {
  BOT = 'bot',
  MANUAL = 'manual',
}

interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  group: MenuGroup;
}

interface Menu {
  BOT: MenuItem[];
  MANUAL: MenuItem[];
}

const SideBar = () => {
  // ┣━━━━━━━━━━━━━━━━ GlobalHooks ━━━━━━━━━━━━━━━━┫
  const { t } = useTranslation();

  const MenuInfo: Menu = {
    BOT: [
      {
        id: 'sercharge',
        title: t('sideBar.sercharge'),
        icon: <SerchargeIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'invoice',
        title: t('sideBar.invoice'),
        icon: <InvoiceIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'booking',
        title: t('sideBar.booking'),
        icon: <BookingIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'schedule',
        title: t('sideBar.schedule'),
        icon: <ScheduleIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'cargo-tracking',
        title: t('sideBar.cargo-tracking'),
        icon: <LocationIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'find-manager',
        title: t('sideBar.find-manager'),
        icon: <PersonSerachIcon />,
        group: MenuGroup.BOT,
      },
    ],
    MANUAL: [
      {
        id: 'hi-quote',
        title: t('sideBar.hi-quote'),
        icon: <RequestQuoteIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'dg-oog',
        title: t('sideBar.dg-oog'),
        icon: <WarningAmberIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'manual-booking',
        title: t('sideBar.manual-booking'),
        icon: <BookingIcon />,
        group: MenuGroup.MANUAL,
      },
    ],
  };

  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setIsSidebarOpen = useUIStore((s) => s.setIsSidebarOpen);

  const onClose = () => {
    setIsSidebarOpen(false);
  };

  const onNavItemClick = (id: string) => {
    const actions: Record<string, () => void> = {
      sercharge: () => console.log('Sercharge clicked'),
      invoice: () => console.log('Invoice clicked'),
      booking: () => console.log('Booking clicked'),
      schedule: () => console.log('Schedule clicked'),
      'cargo-tracking': () => console.log('Cargo tracking clicked'),
      'find-manager': () => console.log('Find a Manager clicked'),
      'hi-quote': () => console.log('Hi quote clicked'),
      'dg-oog': () => console.log('DG/OOG clicked'),
      'manual-booking': () => console.log('Manual Booking clicked'),
    };

    if (actions[id]) {
      actions[id]();
      onClose();
    }
  };

  return (
    <StSideBar anchor="left" open={isSidebarOpen} onClose={onClose}>
      {/*<CloseButton onClick={onClose}>*/}
      {/*  <CloseWIcon />*/}
      {/*</CloseButton>*/}

      <SideBarNav>
        {/* HMM Bot 메뉴 */}
        <ColumnBox>
          <SideBarSectionTitle variant="subtitle2Bold" color="#7EE3F4">
            HMM Bot
          </SideBarSectionTitle>
          <SidebarNav>
            {MenuInfo.BOT.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton onClick={() => onNavItemClick(item.id)}>
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>

        {/* Manual 메뉴 */}
        <ColumnBox>
          <SideBarSectionTitle variant="subtitle2Bold" color="#C1B3FA">
            Manual
          </SideBarSectionTitle>
          <SidebarNav>
            {MenuInfo.MANUAL.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton onClick={() => onNavItemClick(item.id)}>
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>
      </SideBarNav>

      <SideBarFooterTypo variant="body3Light">
        2025 HMM All
        <br /> Rights Reserved
      </SideBarFooterTypo>
    </StSideBar>
  );
};

export default SideBar;

const StSideBar = styled(Drawer)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    background: 'transparent',
  },
  '& .MuiPaper-root': {
    background: theme.palette.primary.main,
    minWidth: '300px',
    padding: '64px 0 40px 26px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    width: '80%',
  },
}));

// eslint-disable no-warning-comments - 화면이 넓이지면 필요할수도 있어서 주석처리
// const CloseButton = styled(IconButton)({
//   position: 'absolute',
//   top: '19px',
//   right: '8px',
//   width: '48px',
//   height: '48px',
// });

const SideBarNav = styled(ColumnBox)({
  gap: '48px',
});

const SideBarSectionTitle = styled(Typography)((props: { color: string }) => ({
  marginBottom: '8px',
  color: props.color,
}));

const SidebarNav = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const SidebarNavItem = styled(ListItem)({
  padding: '0',
});

const SidebarNavButton = styled(Button)({
  gap: '8px',
  padding: '8px 0',
  height: 'auto',
  fontSize: 'inherit',
  textTransform: 'none',
  minWidth: 'auto',
  width: '100%',
  justifyContent: 'flex-start',

  '& svg': {
    width: '20px',
    height: '20px',
  },
});

const SideBarNavTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[200],
}));

const SideBarFooterTypo = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
}));
