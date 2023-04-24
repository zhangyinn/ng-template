import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.less'],
})
export class DefaultLayoutComponent implements OnInit {
  menus: { title: string; path: string }[] = [
    { title: '首页', path: 'home' },
    { title: '分类', path: 'category' },
    { title: '购物车', path: 'cart' },
    { title: '用户', path: 'user' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
