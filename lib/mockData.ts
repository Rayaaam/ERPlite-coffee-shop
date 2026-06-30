import { MenuItem } from "./context";

export const menuItems: MenuItem[] = [
  {
    id: "iceblack",
    name: "Ice Black",
    price: 5500,
    category: "Coffee",
    soldOut: false,
    requiresSize: false,
    image: 'https://images.unsplash.com/photo-1531835207745-506a1bc035d8?w=300&q=80'
  },
  {
    id: "V60",
    name: "V60",
    price: 5500,
    category: "Coffee",
    soldOut: false,
    requiresSize: true,
    image: 'https://images.unsplash.com/photo-1659267450382-433eb3522239?w=300&q=80'
  },
  {
    id: "Kopi susu",
    name: "Kopi Susu",
    price: 3500,
    category: "Coffee",
    soldOut: false,
    requiresSize: true,
    image: 'https://images.unsplash.com/photo-1629688825560-917b9727c15b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWlsayUyMGNvZmZlZXxlbnwwfDB8MHx8fDA%3D'
  },
  {
    id: "espresso",
    name: "Espresso",
    price: 3500,
    category: "Coffee",
    soldOut: false,
    requiresSize: false,
    image: 'https://plus.unsplash.com/premium_photo-1723485688045-b076aa969c9a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGVzcHJlc3NvJTIwY29mZmVlfGVufDB8MHwwfHx8MA%3D%3D'
  },
  {
    id: "americano",
    name: "Americano",
    price: 4000,
    category: "Coffee",
    soldOut: false,
    requiresSize: true,
    image: 'https://images.unsplash.com/photo-1664142638093-9a78da96c425?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFtZXJpY2FubyUyMGNvZmZlZXxlbnwwfDB8MHx8fDA%3D'
  },
  {
    id: "latte",
    name: "Latte",
    price: 5000,
    category: "Coffee",
    soldOut: false,
    requiresSize: true,
    image: 'https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGF0dGUlMjBjb2ZmZWV8ZW58MHwwfDB8fHww'
  },
  {
    id: "Tea",
    name: "Matcha",
    price: 52000,
    category: "Coffee",
    soldOut: true,
    requiresSize: true,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWF0Y2hhfGVufDB8MHwwfHx8MA%3D%3D'
  },
  {
    id: "macchiato",
    name: "Macchiato",
    price: 4500,
    category: "Coffee",
    soldOut: false,
    requiresSize: true,
    image: 'https://images.unsplash.com/photo-1611872515743-b81d6c30605c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjY2hpYXRvJTIwY29mZmVlfGVufDB8MHwwfHx8MA%3D%3D'
  },
  {
    id: "mocha",
    name: "Mocha",
    price: 5500,
    category: "Coffee",
    soldOut: false,
    requiresSize: true,
    image: 'https://images.unsplash.com/photo-1632845407875-10b4d85e6bf8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9jaGElMjBjb2ZmZWV8ZW58MHwwfDB8fHww'
  },
  {
    id: "pastry-croissant",
    name: "Croissant",
    price: 3500,
    category: "Pastry",
    soldOut: false,
    requiresSize: false,
    image: 'https://plus.unsplash.com/premium_photo-1667797527523-fd1574038753?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3JvaXNzYW50JTIwc2FuZHdpY2h8ZW58MHwwfDB8fHww'
  },
  {
    id: "pastry-muffin",
    name: "Blueberry Muffin",
    price: 4000,
    category: "Pastry",
    soldOut: false,
    requiresSize: false,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVmZmlufGVufDB8MHwwfHx8MA%3D%3D'
  },
  {
    id: "pastry-scone",
    name: "Scone",
    price: 3000,
    category: "Pastry",
    soldOut: false,
    requiresSize: false,
    image: 'https://images.unsplash.com/photo-1606946144557-0d04974df266?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2NvbmV8ZW58MHwwfDB8fHww'
  },
  {
    id: "juice-orange",
    name: "Orange Juice",
    price: 3500,
    category: "Juice",
    soldOut: false,
    requiresSize: false,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGp1aWNlfGVufDB8MHwwfHx8MA%3D%3D'
  },
  {
    id: "juice-mango",
    name: "Mango Juice",
    price: 3500,
    category: "Juice",
    soldOut: false,
    requiresSize: false,
    image: 'https://media.istockphoto.com/id/1181659429/id/foto/jus-smoothie-mangga-dan-buah-un-minum-gelas-di-atas-meja-kayu-di-dapur-pedesaan.webp?a=1&b=1&s=612x612&w=0&k=20&c=7EvAXuXGDEPos4d7wTQ56wlhlu4fLUovaCP96FsK-1g='
  },
  {
    id: "cocktails",
    name: "Cocktails",
    price: 3500,
    category: "Juice",
    soldOut: false,
    requiresSize: false,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ja3RhaWxzfGVufDB8MHwwfHx8MA%3D%3D'
  },
];

export const categories = ["Coffee", "Pastry", "Juice"];
