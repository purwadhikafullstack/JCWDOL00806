import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <div className='bg-blue-first py-10'>
      <div className='lg:px-16 md:px-10 px-5'>
        <div 
          className='flex md:flex-row flex-col 
          justify-between gap-5 text-white'
        >
          <div className='sm:w-2/3 w-full font-bold mb-5'>
            <div className='mb-3 text-3xl'>
              D'SEWA
            </div>
            <div className='text-xl'>
              Find your perfect stay, wherever you go.
            </div>
          </div>

          <div 
            className='flex justify-between 
            lg:gap-32 gap-10'
          >
            <div className='flex flex-col gap-3'>
                <div className='font-bold'>D'Sewa Connections</div>
                <div className='cursor-pointer'>About D'Sewa</div>
                <div className='cursor-pointer'>Teams / Careers</div>
                <div className='cursor-pointer'>Partner With Us</div>
                <div className='cursor-pointer'>24/7 Customer Support Chat</div>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='font-bold'>Useful Links</div>
                <div className='cursor-pointer'>Privacy Policy</div>
                <div className='cursor-pointer'>Terms & Services</div>
                <div className='cursor-pointer'>Guest Policy</div>
              </div>
          </div>
        </div>

        <hr className='mb-3 mt-10' />
        
        <div 
          className='flex sm:flex-row flex-col 
          gap-2 justify-between items-center'
        >
          <span 
            className='text-lg font-semibold 
            text-white'
          >
            © 2023 D'SEWA, All rights reserved.
          </span>
          <div className='flex gap-5 items-center'>
            <FontAwesomeIcon 
              icon={faInstagram} 
              size="xl" 
              className='cursor-pointer'
              style={{color: "#FFF"}}
            />
            <FontAwesomeIcon 
              icon={faFacebook} 
              size="xl" 
              className='cursor-pointer'
              style={{color: "#FFF"}}
            />
            <FontAwesomeIcon 
              icon={faTwitter} 
              size="xl" 
              className='cursor-pointer'
              style={{color: "#FFF"}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer