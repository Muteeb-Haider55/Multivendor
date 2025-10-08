import React from "react";
import styles from "../../styles/styles";
import ShopProfileData from "../../components/shop/ShopProfileData";
import ShopInfo from "../../components/shop/ShopInfo";
import Header from "../../components/Layout/Header";

const ShopPreviewPage = () => {
  return (
    <div className={`${styles.section} bg-[#f5f5f5]`}>
      <Header />
      <div className="w-full 800px:flex  py-10 justify-between overflow-y-scroll">
        <div className="800px:w-[25%] bg-[#fff] rounded-[4px] shadow-sm overflow-y-scroll 800px:h-[90vh] 800px:sticky top-10 left-0 z-10">
          <ShopInfo isOwner={false} />
        </div>
        <div className="800px:w-[72%] mt-5 800px:mt-['unset'] rounded-[4px] ">
          <ShopProfileData isOwner={false} />
        </div>
      </div>
    </div>
  );
};

export default ShopPreviewPage;
