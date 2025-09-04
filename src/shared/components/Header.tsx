import { Box, type BoxProps, styled } from '@mui/material'

const Header = () => {
  return <StyledHeader component={'footer'}></StyledHeader>
}

export default Header

const StyledHeader = styled(Box)<BoxProps>({
  width: '100%',
  height: '60px',
  background: 'lightblue',
})
