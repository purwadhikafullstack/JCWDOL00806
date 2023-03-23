import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { Image } from "@chakra-ui/react"

const PropertyCard = ({ data }) => {
  const getImageSource = (link) => {
    let image = `${process.env.REACT_APP_SERVER_URL}/image/${link
      ?.replace(/"/g, "")
      .replace(/\\/g, "/")}`;

    return image
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className='flex flex-col w-full'>
      <div 
        className='overflow-hidden rounded-lg 
        sm:h-[250px] border shadow-lg'
      >
        <Image
          boxSize="100%"
          objectFit="cover"
          src={`${getImageSource(data.picture)}`}
          alt={data.name}
        />
      </div>

      <div 
        className='mt-3 flex flex-row 
        items-center justify-between'
      >
        <div 
          className='font-semibold text-lg 
          whitespace-nowrap overflow-hidden 
          text-ellipsis'
        >
          {data?.name}, {data?.city}
        </div>

        <div 
          className='flex justify-end 
          items-center w-12'
        >
          <FontAwesomeIcon icon={faStar} />
          <span className='ml-2'>
            5,0
          </span>
        </div>
      </div>

      <div>{data?.type}</div>

        <div className='text-base'>
          <span className='font-semibold'>
            {formatter.format(data?.price)}
          </span>
          <span className='ml-2'>per night</span>
        </div>
    </div>
  )
}

export default PropertyCard