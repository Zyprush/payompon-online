import ChangeEmail from '@/app/admin/settings/ChangeEmail'
import UserNavLayout from '@/components/UserNavLayout'
import React from 'react'

const page = () => {
  return (
    <UserNavLayout>
        <div>
            <ChangeEmail />
        </div>
    </UserNavLayout>
  )
}

export default page