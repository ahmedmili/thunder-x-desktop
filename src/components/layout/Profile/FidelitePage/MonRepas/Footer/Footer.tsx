import React, { useEffect, useState } from 'react'

import "./footer.scss"

interface FooterProps {
    Ftitle: string,
    Fbody: string,

}

const RepasFooter: React.FC<FooterProps> = ({ Ftitle, Fbody }) => {

    return (

        <>
            <section className='repas-footer-container' >
                <div className='footer-title-container'>
                    <p className='title'>{Ftitle}</p>
                </div>
                <div className='footer-descirtion'>
                    <p className='discription' > {Fbody}</p>
                </div>
            </section>
        </>
    )
}

export default RepasFooter