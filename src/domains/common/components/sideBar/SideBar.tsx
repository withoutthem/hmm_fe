import { Drawer, List, ListItem, styled, Typography, Button, IconButton } from '@mui/material';
import useUIStore from '@domains/common/ui/store/ui.store';
import { ColumnBox } from '@shared/ui/layoutUtilComponents';
import { CloseW } from '@shared/icons/CloseW';
import { Booking } from '@shared/icons/Booking';
import { Invoice } from '@shared/icons/Invoice';
import { Location } from '@shared/icons/Location';
import { PersonSerach } from '@shared/icons/PersonSerach';
import { RequestQuote } from '@shared/icons/RequestQuote';
import { Schedule } from '@shared/icons/Schedule';
import { Sercharge } from '@shared/icons/Sercharge';
import { WarningAmber } from '@shared/icons/WarningAmber';
import React, { type ReactNode } from 'react';

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
  const MenuInfo: Menu = {
    BOT: [
      {
        id: 'sercharge',
        title: 'Sercharge',
        icon: <Sercharge />,
        group: MenuGroup.BOT,
      },
      {
        id: 'invoice',
        title: 'Invoice',
        icon: <Invoice />,
        group: MenuGroup.BOT,
      },
      {
        id: 'booking',
        title: 'Booking/BL',
        icon: <Booking />,
        group: MenuGroup.BOT,
      },
      {
        id: 'schedule',
        title: 'Schedule',
        icon: <Schedule />,
        group: MenuGroup.BOT,
      },
      {
        id: 'cargo-tracking',
        title: 'Cargo tracking',
        icon: <Location />,
        group: MenuGroup.BOT,
      },
      {
        id: 'find-manager',
        title: 'Find a Manager',
        icon: <PersonSerach />,
        group: MenuGroup.BOT,
      },
    ],
    MANUAL: [
      {
        id: 'hi-quote',
        title: 'Hi quote',
        icon: <RequestQuote />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'dg-oog',
        title: 'DG/OOG',
        icon: <WarningAmber />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'manual-booking',
        title: 'Booking/BL',
        icon: <Booking />,
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
      <CloseButton onClick={onClose}>
        <CloseW />
      </CloseButton>

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

const StSideBar = styled(Drawer)({
  '& .MuiBackdrop-root': {
    background: 'transparent',
  },
  '& .MuiPaper-root': {
    background: '#20265B',
    minWidth: '300px',
    padding: '64px 0 40px 26px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    width: '80%',
  },
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '19px',
  right: '8px',
  width: '48px',
  height: '48px',
});

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

const SideBarFooterTypo = styled(Typography)({
  color: '#777DB3',
});
