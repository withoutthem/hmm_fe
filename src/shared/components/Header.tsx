import { Box, type BoxProps, styled } from '@mui/material'

const Header = () => {
  return <StyledHeader component={'header'}></StyledHeader>
}

export default Header

const StyledHeader = styled(Box)<BoxProps>({
  width: '100%',
  height: '48px',
  background: '#fff',
  position: 'relative',

  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '1px',
    background: '#e0e0e0',
  },
})
