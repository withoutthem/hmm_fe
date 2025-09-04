import React from 'react'
import Box from '@mui/material/Box'
import Header from '@shared/components/Header'
import Footer from '@shared/components/Footer'
import { type BoxProps, styled } from '@mui/material'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <StyledLayout className={'layout'}>
      <Header />
      <StyledMain component="main">{children}</StyledMain>
      <Footer />
    </StyledLayout>
  )
}

export default Layout

const StyledLayout = styled(Box)<BoxProps>({
  width: '100%',
  height: '100%',
  background: 'lightgreen',
  display: 'flex',
  flexDirection: 'column',
})

const StyledMain = styled(Box)<BoxProps>({
  width: '100%',
  flex: 1,
  background: 'lightcoral',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px',
})
