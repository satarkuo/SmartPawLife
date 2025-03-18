import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import useScreenSize from '../../hooks/useScreenSize';
import timeLineData from '../../data/timeLineData.js';

import banner1Lg from '../../assets/img/banner/about/banner1-lg.png';
import banner1Md from '../../assets/img/banner/about/banner1-md.png';
import cover from '../../assets/img/front/cover-about.png';

const bannerImgs = [
    {
        lg: banner1Lg,
        md: banner1Md,
        title: '關於 SmartPaw Life',
        content: '隨時隨地，與您的毛孩保持聯繫，給予他們更多關愛與陪伴'
    }
]

const About = () => {

    //swiper RWD:自訂hook
    const { screenWidth } = useScreenSize();
    const isMobile = screenWidth < 640; // 螢幕寬 < 640，返回true，否則返回false

    return (
        <section className='aboutPage'>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={0} // 幻燈片之間的間距
                slidesPerView={1} // 一次顯示幾張
                //navigation // 左右箭頭
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className='swiperBanner'
                loop={bannerImgs.length >= 2}
                >
                {bannerImgs.map((img,i) => (
                    <SwiperSlide key={i}>
                        <div className='container detail text-center'>
                            <p className={isMobile? 'h4' : 'h2'}>{img.title}</p>
                            <p className={isMobile? 'h6' : 'h4'}>{img.content}</p>
                        </div>
                        <img src={isMobile ? img.md : img.lg} alt={img.title} className='w-100'/>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="container pb-5 pt-0 pt-md-5">
                <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
                    <span className="titleUnderline"><span>品牌年表</span></span>
                </h2>
                <ul className='timeLine mb-5'>
                    {timeLineData.map(item => (
                        <li key={item.title}>
                            <span className='textBody2 timeLineYear'>{item.year}</span>
                            <span className='line-box'>
                                <span className='iconBox'>
                                    {item.title === '首款產品' ? (
                                        <img src={item.icon} alt={item.title} width='24' height='24' className="align-self-center"/>
                                        ) : (
                                        <span className="material-icons align-content-center fs-4">{item.icon}</span>) } 
                                </span>
                            </span>
                            
                            <span className='con flex-fill'>
                                <p className={`${isMobile ? 'h6' : 'h5'} text-primary mb-2`}>{item.title}</p>
                                <p className={`${isMobile ? 'textBody3' : 'textBody2'} m-0`}
                                    style={{textAlign: 'justify'}}>{item.content}</p>
                            </span>
                        </li>
                    ))}
                    
                </ul>
            </div>
            <div className="bg-primaryPestel pb-5">
                <div className="container pb-5 pt-0 pt-md-5 ">
                    <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
                        <span className="titleUnderline"><span>品牌故事</span></span>
                    </h2>
                    <ul className='d-flex flex-column' style={{gap: '36px'}}>
                        <li>
                            <p className={`${isMobile ? 'textBody2' : 'textBody1'} m-0`} style={{textAlign: 'justify'}}>
                                在現今快節奏的生活中，飼主們面臨著許多挑戰，無論是工作、家庭還是社交生活，常常讓我們無法全程陪伴在寵物身旁。然而，寵物作為我們家庭的一部分，它們需要的不僅是食物與水，還有愛、關注與陪伴。SmartPaw Life 的誕生正是源於這樣的需求——讓寵物生活更加智能、更加健康，讓每位飼主都能輕鬆照顧寵物，並與牠們建立更加親密的連結。
                            </p>
                        </li>
                        <li>
                            <h5 className={`${isMobile ? 'h6' : 'h5'} text-primary`}>創始理念：從關愛出發，讓科技成為寵物守護者</h5>
                            <p className={`${isMobile ? 'textBody2' : 'textBody1'} m-0`} style={{textAlign: 'justify'}}>
                                在現今快節奏的生活中，飼主們面臨著許多挑戰，無論是工作、家庭還是社交生活，常常讓我們無法全程陪伴在寵物身旁。然而，寵物作為我們家庭的一部分，它們需要的不僅是食物與水，還有愛、關注與陪伴。SmartPaw Life 的誕生正是源於這樣的需求——讓寵物生活更加智能、更加健康，讓每位飼主都能輕鬆照顧寵物，並與牠們建立更加親密的連結。
                            </p>
                        </li>
                        <li>
                            <h5 className={`${isMobile ? 'h6' : 'h5'} text-primary`}>智能化的願景：提升寵物的生活品質</h5>
                            <p className={`${isMobile ? 'textBody2' : 'textBody1'} m-0`} style={{textAlign: 'justify'}}>
                            SmartPaw Life 不僅是一個品牌，更是一個關於寵物健康和幸福的使命。從我們的首款智能寵物攝像頭，到自動餵食器、健康監測項圈，每一款產品都凝聚著對寵物的關愛。每一個產品背後，都是一個團隊對於品質、創新與實用性的承諾，致力於讓科技與寵物的生活更貼近、更加舒適。 Life 的誕生正是源於這樣的需求——讓寵物生活更加智能、更加健康，讓每位飼主都能輕鬆照顧寵物，並與牠們建立更加親密的連結。
                            </p>
                        </li>
                        <li>
                            <h5 className={`${isMobile ? 'h6' : 'h5'} text-primary`}>永續創新：從當下到未來</h5>
                            <p className={`${isMobile ? 'textBody2' : 'textBody1'} m-0`} style={{textAlign: 'justify'}}>
                            SmartPaw Life 進入2024年，SmartPaw Life 依然秉持著不斷創新的精神，持續推出更多有助於改善寵物生活品質的智能產品。我們的目標是讓每一位飼主都能夠擁有更輕鬆的照顧方式，並能與自己的寵物保持更深的聯繫。我們的產品不僅僅是工具，更是飼主與寵物之間的橋樑，讓愛在每一個瞬間流動。 Life 的誕生正是源於這樣的需求——讓寵物生活更加智能、更加健康，讓每位飼主都能輕鬆照顧寵物，並與牠們建立更加親密的連結。
                            </p>
                        </li>
                        <li>
                            <h5 className={`${isMobile ? 'h6' : 'h5'} text-primary`}>品牌使命：智能科技，溫暖陪伴</h5>
                            <p className={`${isMobile ? 'textBody2' : 'textBody1'} m-0`} style={{textAlign: 'justify'}}>
                            SmartPaw Life 的使命，不僅是提供智能科技，更是提供一份來自心底的溫暖與關懷。未來，我們將繼續推動產品創新，提升智能技術，並加強社會責任，與更多動物保護機構合作，讓每一隻寵物都能夠享受到健康、幸福的生活。我们希望，无论您身处何地，都能通过我们的产品，继续爱护和陪伴您的毛孩子，让它们在智能科技的守护下，过上更加美好的生活。
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container pb-5 pt-0 pt-md-5 ">
                <h2 className={`${isMobile ? 'h3' : 'h2'} text-center py-5`}>
                    <span className="titleUnderline"><span>社會責任</span></span>
                </h2>
                <div className='row'>
                    <div className='col-12 col-md-5'>
                        <img src={cover} className='rounded-3 mb-3 mb-md-0' style={{maxWidth: '100%'}}/>
                    </div>
                    <div className='col-12 col-md-7 d-flex flex-column justify-content-center'>
                        <h5 className='h5 text-primary'>攜手關懷，共同守護寵物的未來</h5>
                        <p className={`${isMobile ? 'textBody2' : 'textBody1'} m-0`} style={{textAlign: 'justify'}}>
                            在 SmartPaw Life，我們深知，除了關注自家寵物的健康和幸福外，還應該承擔更多的社會責任。作為一個致力於寵物生活品質提升的品牌，我們不僅關心消費者的需求，更重視那些無家可歸、需要幫助的動物。<br/>
                            我們積極與多個動物救援機構、動物保護組織合作，提供資源支持和必要的技術支持，幫助流浪動物找到新的家園，並提供健康管理服務。我們的目標是讓每一隻寵物都能夠過上健康、幸福的生活，無論牠們曾經經歷過什麼。<br/>
                            此外，SmartPaw Life 也致力於推動可持續發展，所有的產品設計和製造過程都遵循環保原則，最大程度減少對環境的影響。我們相信，只有創造出對動物和環境都有益的產品，才能讓我們的社會變得更加美好。
                        </p>
                    </div>
                </div>
            </div> 
            
        </section>
        
    )
}
export default About;