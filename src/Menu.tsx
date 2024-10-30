// Menu.tsx
import React from 'react';

interface MenuProps {
  nickname: string;
}

const Menu = ({ nickname }: MenuProps) => {
  return (
    <div>
      <h1>환영합니다, {nickname}님!</h1>
      <p>이곳은 Menu 페이지입니다.</p>
    </div>
  );
};

export default Menu;
