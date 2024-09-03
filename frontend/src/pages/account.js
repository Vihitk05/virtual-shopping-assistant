import { Box, Button, Flex, Heading, Input, Select } from '@chakra-ui/react';
import Footer from '../components/footer';
import { Navbar } from '../components/navbar';
import { useState } from 'react';

export default function Account() {
    const [isEdit,setEdit] = useState(true);
  return (
    <>
      <Navbar />
      <Box my="5%">
        <Box px="10%">
          <Heading>Account Information</Heading>
          <Flex my="2%" gap="10%">
            <Input placeholder="First Name" disabled={isEdit} type="text" />
            <Input placeholder="Last Name" disabled={isEdit} type="text" />
          </Flex>
          <Flex my="2%" gap="10%">
            <Input placeholder="Email" disabled={isEdit} type="email" />
            <Input placeholder="Phone Number" disabled={isEdit} type="number" />
          </Flex>
          <Flex my="2%" gap="10%">
            <Input placeholder="Address 1" disabled={isEdit} type="text" />
            <Input placeholder="Address 2" disabled={isEdit} type="text" />
          </Flex>
          <Flex my="2%" gap="10%">
            <Input placeholder="City" disabled={isEdit} type="text" />
            <Input placeholder="Pincode" disabled={isEdit} type="number" />
          </Flex>
          <Flex my="2%" gap="10%">
            <Input placeholder="State" disabled={isEdit} type="text" />
            <Input placeholder="Country" disabled={isEdit} type="text" />
          </Flex>
          <Flex my="2%" gap="10%">
            <Input placeholder="Select Date of Birth" disabled={isEdit} type="date" />
            <Select placeholder="Gender" disabled={isEdit}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </Select>
          </Flex>
          <Flex justifyContent="space-between">
            <Button onClick={()=>setEdit(!isEdit)}>Edit</Button>
            <Button colorScheme='blue' isDisabled={isEdit}>Save</Button>
          </Flex>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
