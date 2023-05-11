import React from 'react'
import { Navbar as MantineNavbar } from '@mantine/core'
type Props = {}

const Navbar = (props: Props) => {
  return (
    <MantineNavbar width={{ base: 300 }} height={500} p="xs">
      {/* Navbar content */}
    </MantineNavbar>
  )
}

export default Navbar
