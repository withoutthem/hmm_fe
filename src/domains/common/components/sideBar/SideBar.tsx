// src/domains/common/components/sideBar/SideBar.tsx

import { Drawer, List, ListItem, styled, Typography, Button } from '@mui/material';
import useUIStore, { SelectBottomSheetType } from '@domains/common/ui/store/ui.store';
import { ColumnBox } from '@shared/ui/layoutUtilComponents';
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
import useChatFlow from '@domains/common/hooks/useChatFlow';
import { TestButton } from '@/domains/chatbot/components/button/TestButton';
import useUserStore from '@domains/user/store/user.store';
import type { SupportedLocale } from '@shared/locale/resolve';

enum MenuGroup {
  BOT = 'bot',
  MANUAL = 'manual',
  SUPPORT = 'support',
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
  SUPPORT: MenuItem[];
}

const LOCALE_CYCLE = ['ko-KR', 'en-US', 'zh-CN', 'ja-JP'] as const;

const SideBar = () => {
  // ┣━━━━━━━━━━━━━━━━ GlobalHooks ━━━━━━━━━━━━━━━━┫
  const { t } = useTranslation();
  const { run } = useChatFlow();

  // ┣━━━━━━━━━━━━━━━━ Stores ━━━━━━━━━━━━━━━━━━━━━┫
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setIsSidebarOpen = useUIStore((s) => s.setIsSidebarOpen);
  const openBottomSheet = useUIStore((s) => s.setBottomSheetOpen);

  const globalLocale = useUserStore((s) => s.globalLocale);
  const setGlobalLocale = useUserStore((s) => s.setGlobalLocale);

  // ┣━━━━━━━━━━━━━━━━ Menu Labels (i18n keys matched to JSON) ━━━━━━━━━━━━━┫
  const MenuInfo: Menu = {
    BOT: [
      {
        id: 'ai-route',
        title: t('sideBar.ai-route'),
        icon: <ScheduleIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'find-manager',
        title: t('sideBar.find-manager'),
        icon: <PersonSerachIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'schedule',
        title: t('sideBar.schedule'),
        icon: <ScheduleIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'sercharge',
        title: t('sideBar.sercharge'),
        icon: <SerchargeIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'manual-booking',
        title: t('sideBar.manual-booking'),
        icon: <BookingIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'invoice',
        title: t('sideBar.invoice'),
        icon: <InvoiceIcon />,
        group: MenuGroup.BOT,
      },
      {
        id: 'instant-quote',
        title: t('sideBar.instant-quote'),
        icon: <RequestQuoteIcon />,
        group: MenuGroup.BOT,
      },
    ],
    MANUAL: [
      {
        id: 'general-cargo',
        title: t('sideBar.general-cargo'),
        icon: <BookingIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'dg-oog',
        title: t('sideBar.dg-oog'),
        icon: <WarningAmberIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'hi-quote',
        title: t('sideBar.hi-quote'),
        icon: <RequestQuoteIcon />,
        group: MenuGroup.MANUAL,
      },
      {
        id: 'doc-forms',
        title: t('sideBar.doc-forms'),
        icon: <InvoiceIcon />,
        group: MenuGroup.MANUAL,
      },
    ],
    SUPPORT: [
      {
        id: 'connect-to-agent',
        title: t('sideBar.connect-to-agent'),
        icon: <PersonSerachIcon />,
        group: MenuGroup.SUPPORT,
      },
      {
        id: 'chat-history',
        title: t('sideBar.chat-history'),
        icon: <PersonSerachIcon />,
        group: MenuGroup.SUPPORT,
      },
      {
        id: 'faq',
        title: t('sideBar.faq'),
        icon: <LocationIcon />,
        group: MenuGroup.SUPPORT,
      },
      {
        id: 'user-lang',
        title: t('sideBar.user-lang'),
        icon: <ScheduleIcon />,
        group: MenuGroup.SUPPORT,
      },
    ],
  };

  // ┣━━━━━━━━━━━━━━━━ Handlers ━━━━━━━━━━━━━━━━━━━┫
  const onClose = () => setIsSidebarOpen(false);

  const speak = (utterLabel: string) => {
    run(utterLabel, { simulate: true });
    onClose();
  };

  const onChangeLangClick = () => {
    const nowIdx = LOCALE_CYCLE.indexOf(globalLocale as (typeof LOCALE_CYCLE)[number]);
    const next = LOCALE_CYCLE[
      (nowIdx === -1 ? 0 : nowIdx + 1) % LOCALE_CYCLE.length
    ] as SupportedLocale;
    setGlobalLocale(next);
  };

  const onSupportClick = (itemId: string, title: string) => {
    if (itemId === 'user-lang') {
      // 바텀시트 오픈 (언어 설정)
      // openBottomSheet(SelectBottomSheetType.LANGUAGE);
      onClose();
      return;
    }
    speak(title);
  };

  // ┣━━━━━━━━━━━━━━━━ Render ━━━━━━━━━━━━━━━━━━━━━┫
  return (
    <StSideBar anchor="left" open={isSidebarOpen} onClose={onClose}>
      <SideBarNav>
        {/* Bot */}
        <ColumnBox>
          <SideBarSectionTitle variant="subtitle2Bold" color="#7EE3F4">
            {t('sideBar.section.bot')}
          </SideBarSectionTitle>
          <SidebarNav>
            {MenuInfo.BOT.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton onClick={() => speak(item.title)}>
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>

        {/* 규정/메뉴얼 */}
        <ColumnBox>
          <SideBarSectionTitle variant="subtitle2Bold" color="#C1B3FA">
            {t('sideBar.section.manual')}
          </SideBarSectionTitle>
          <SidebarNav>
            {MenuInfo.MANUAL.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton onClick={() => speak(item.title)}>
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>

        {/* 지원/기타 */}
        <ColumnBox>
          <SidebarNav>
            {MenuInfo.SUPPORT.map((item) => (
              <SidebarNavItem key={item.id}>
                <SidebarNavButton onClick={() => onSupportClick(item.id, item.title)}>
                  {item.icon}
                  <SideBarNavTypography variant="body1">{item.title}</SideBarNavTypography>
                </SidebarNavButton>
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </ColumnBox>
      </SideBarNav>

      {/* 테스트: 4개 로케일 로테이션 */}
      <TestButton onClick={onChangeLangClick}>
        TESTBUTTON 언어바꾸기 (현재: {globalLocale})
      </TestButton>

      <SideBarFooterTypo variant="body3Light">
        2025 HMM All
        <br /> Rights Reserved
      </SideBarFooterTypo>
    </StSideBar>
  );
};

export default SideBar;

const StSideBar = styled(Drawer)(({ theme }) => ({
  '& .MuiBackdrop-root': { background: 'transparent' },
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

const SideBarNav = styled(ColumnBox)({ gap: '48px' });

const SideBarSectionTitle = styled(Typography)((props: { color: string }) => ({
  marginBottom: '8px',
  color: props.color,
}));

const SidebarNav = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const SidebarNavItem = styled(ListItem)({ padding: 0 });

const SidebarNavButton = styled(Button)({
  gap: '8px',
  padding: '8px 0',
  height: 'auto',
  fontSize: 'inherit',
  textTransform: 'none',
  minWidth: 'auto',
  width: '100%',
  justifyContent: 'flex-start',
  '& svg': { width: 20, height: 20 },
});

const SideBarNavTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[200],
}));

const SideBarFooterTypo = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.contrastText,
}));
