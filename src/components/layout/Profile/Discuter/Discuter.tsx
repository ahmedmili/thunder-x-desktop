import React from 'react'
import './discuter.scss'
import Cover from '../../../../assets/profile/Discuter/cover.png'
import Service from '../../../../assets/profile/Discuter/Service-24-7.png'
function Discuter() {
    return (
        <div className='discuter-main-container'>
            <header className='discuter-header'>
                <h3 className='title-message'>Discuter avec nous !</h3>
                <div className='cover-img' style={{ backgroundImage: `url(${Cover})` }} >
                </div>
            </header >
            <main className='discuter-main'>
                <div className='aide-service'>
                    <h2 className='title'>Besoin d’aide ?</h2>
                    <p className='sub-title'>Contactez le support client</p>
                    <div className='buttons'>
                        <button className='btn1'>J’ai quelque chose à dire</button>
                        <button className='support-client'>Contactez le support client</button>
                    </div>
                </div>
                <div className='aide-service'>
                    <h2 className='title'>Service clientel</h2>
                    <p className='sub-title'>Disponible 24/7</p>
                    <div className='service-24' style={{ backgroundImage: ` url(${Service})` }}>

                    </div>
                </div>
            </main>
        </div >
    )
}

export default Discuter