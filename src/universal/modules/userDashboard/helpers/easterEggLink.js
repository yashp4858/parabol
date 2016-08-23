import React from 'react';
import theme from 'universal/styles/theme';

const eggs = [
  {
    string: 'Carpe Diem',
    link: 'https://youtu.be/veYR3ZC9wMQ'
  },
  {
    string: 'Keep Moving Forward',
    link: 'https://youtu.be/5HksV7ZFuhM'
  },
  {
    string: 'Discombobulate',
    link: 'https://youtu.be/UxfauhR7niY'
  }
];

const egg = eggs[Math.floor(Math.random() * eggs.length)];

const eggString = `${egg.string}!`;

const style = {
  color: theme.palette.dark70l
};

export default function easterEggLink(hasStyle = true) {
  return (
    <a
      href={egg.link}
      style={hasStyle ? style : null}
      target="_blank"
      title={eggString}
    >
      {eggString}
    </a>
  );
}
