import { Drawer, List, ListItem, styled, Typography, Button, IconButton } from '@mui/material';
import useUiStore from '@domains/common/ui/store/ui.store';
import { ColumnBox } from '@shared/ui/layoutUtilComponents';
import { CloseWIcon } from '@shared/icons/CloseWIcon';
import { BookingIcon } from '@shared/icons/BookingIcon';
import { InvoiceIcon } from '@shared/icons/InvoiceIcon';
import { LocationIcon } from '@shared/icons/LocationIcon';
import { PersonSerachIcon } from '@shared/icons/PersonSerachIcon';
import { RequestQuoteIcon } from '@shared/icons/RequestQuoteIcon';
import { ScheduleIcon } from '@shared/icons/ScheduleIcon';
import { SerchargeIcon } from '@shared/icons/SerchargeIcon';
import { WarningAmberIcon } from '@shared/icons/WarningAmberIcon';
import React, { type ReactNode } from 'react';

interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  group: 'bot' | 'manual';
}

const MenuList: MenuItem[] = [
  {
    id: 'sercharge',
    title: 'Sercharge',
    icon: <SerchargeIcon />,
    group: 'bot',
  },
  {
    id: 'invoice',
    title: 'Invoice',
    icon: <InvoiceIcon />,
    group: 'bot',
  },
  {
    id: 'booking',
    title: 'Booking/BL',
    icon: <BookingIcon />,
    group: 'bot',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    icon: <ScheduleIcon />,
    group: 'bot',
  },
  {
    id: 'cargo-tracking',
    title: 'Cargo tracking',
    icon: <LocationIcon />,
    group: 'bot',
  },
  {
    id: 'find-manager',
    title: 'Find a Manager',
    icon: <PersonSerachIcon />,
    group: 'bot',
  },
  {
    id: 'hi-quote',
    title: 'Hi quote',
    icon: <RequestQuoteIcon />,
    group: 'manual',
  },
  {
    id: 'dg-oog',
    title: 'DG/OOG',
    icon: <WarningAmberIcon />,
    group: 'manual',
  },
  {
    id: 'manual-booking',
    title: 'Booking/BL',
    icon: <BookingIcon />,
    group: 'manual',
  },
];

const SideBar = () => {
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const setIsSidebarOpen = useUiStore((s) => s.setIsSidebarOpen);

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
    <StyledSideBar anchor="left" open={isSidebarOpen} onClose={onClose}>
      <CloseButton onClick={onClose}>
        <CloseWIcon />
      </CloseButton>

      <SideBarNav>
        {/* HMM Bot 메뉴 */}
        <ColumnBox>
          <SideBarSectionTitle variant="subtitle2Bold" color="#7EE3F4">
            HMM Bot
          </SideBarSectionTitle>
          <SidebarNav>
            {MenuList.filter((item) => item.group === 'bot').map((item) => (
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
            {MenuList.filter((item) => item.group === 'manual').map((item) => (
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
    </StyledSideBar>
  );
};

export default SideBar;

const StyledSideBar = styled(Drawer)({
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
