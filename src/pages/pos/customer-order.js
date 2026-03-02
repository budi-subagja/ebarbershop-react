import React, { useEffect, useContext, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import { Modal } from 'bootstrap';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/authContext.jsx';
import { getLayananAPI, getCapsterAPI } from '../../config/api';

function PosCustomerOrder() {
	const { user } = useAuth();
	const context = useContext(AppSettings);
	const [posMobileSidebarToggled, setPosMobileSidebarToggled] = useState(false);
	const [categoryType, setCategoryType] = useState('all');
	const [tableData, setTableData] = useState({ category: [], food: [] });
	const [orderData, setOrderData] = useState([]);
	const [orderHistoryData, setOrderHistoryData] = useState([]);
	const [modal, setModal] = useState();
	const [modalData, setModalData] = useState();
	const [modalQuantity, setModalQuantity] = useState(1);
	const [modalSelectedSize, setModalSelectedSize] = useState();
	const [modalSelectedAddon, setModalSelectedAddon] = useState([]);
	const [capsters, setCapsters] = useState([]);
	const [selectedCapster, setSelectedCapster] = useState("");
	const navigate = useNavigate();
	
	var toggleMobileSidebar = (event) => {
		event.preventDefault();
		
		setPosMobileSidebarToggled(true);
	}
	
	var dismissMobileSidebar = (event) => {
		event.preventDefault();
		
		setPosMobileSidebarToggled(false);
	}
	
	var showType = (event, type) => {
	event.preventDefault();

	if (!tableData?.food) return;

	const updatedFood = tableData.food.map(item => ({
		...item,
		hide: !(item.type === type || type === 'all')
	}));

	setTableData({
		...tableData,
		food: updatedFood
	});

	setCategoryType(type);
	};
	
	var showPosItemModal = (event, food) => {
		event.preventDefault();
		
		// Pastikan modal sudah terdefinisi sebelum memanggil .show()
		if (food.available && modal) {
			setModalData(food);
			setModalQuantity(1);
			setModalSelectedAddon([]);
			setSelectedCapster(""); // RESET DI SINI
			
			modal.show();
		} else {
			console.error("Modal belum siap atau barang tidak tersedia");
		}
	}
	
	var getOrderTotal = () => {
		return (orderData) ? orderData.length : 0;
	}
	
	var getOrderHistoryTotal = () => {
		return (orderHistoryData) ? orderHistoryData.length : 0;
	}
	
	var deductQty = (event, id) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.map(obj => {
				if (obj.id === id) {
					var newQty = parseInt(obj.quantity) - 1;
					
					if (newQty < 1) {
						newQty = 1;
					}
					return {...obj, quantity: newQty};
				}
				
				return obj;
			});
			
			setOrderData(newData);
		}
	}
	
	var addQty = (event, id) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.map(obj => {
				if (obj.id === id) {
					var newQty = parseInt(obj.quantity) + 1;
					return {...obj, quantity: newQty};
				}
				
				return obj;
			});
			
			setOrderData(newData);
		}
	}
	
	var getSubTotalPrice = () => {
		var value = 0;
		
		if (orderData) {
			for (var i = 0; i < orderData.length; i++) {
				value += parseFloat(orderData[i].price) * parseInt(orderData[i].quantity);
			}
		}
		return value.toFixed(2);
	}
	
	var getTaxesPrice = () => {
		var value = 0;
		
		if (orderData) {
			for (var i = 0; i < orderData.length; i++) {
				value += parseFloat(orderData[i].price) * parseInt(orderData[i].quantity) * .06;
			}
		}
		return value.toFixed(2);
	}
		
	var getTotalPrice = () =>  {
		var value = 0;
		if (orderData) {
			for (var i = 0; i < orderData.length; i++) {
				value += parseFloat(orderData[i].price) * parseInt(orderData[i].quantity);
			}
		}
		// Return tanpa tambahan 0.06
		return value.toFixed(2);
	}

	
	var toggleConfirmation = (event, id, value) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.map(obj => {
				if (obj.id === id) {
					return {...obj, confirmation: value};
				}
				return obj;
			});
			
			setOrderData(newData);
		}
	}
	
	var removeOrder = (event, id) => {
		event.preventDefault();
		
		if (orderData) {
			const newData = orderData.filter(function(order) { 
				return order.id !== id
			});
			
			setOrderData(newData);
		}
	}
	
	var addModalQty = (event) => {
		event.preventDefault();
		if (modalQuantity) {
			var newQty = parseInt(modalQuantity) + 1;
			
			setModalQuantity(newQty);
		}
	}
	
	var deductModalQty = (event) => {
		event.preventDefault();
		
		if (modalQuantity) {
			var newQty = parseInt(modalQuantity) - 1;
		
			if (newQty < 1) {
				newQty = 1;
			}
			setModalQuantity(newQty);
		}
	}
	
	var handleSizeChange = (event) => {
		var value = '';
		if (event.target.checked) {
			value = event.target.value;
		}
		
		setModalSelectedSize(value);
	}
	
	var handleAddonChange = (event) => {
		var elms = [].slice.call(document.querySelectorAll('input[name="addon"]'));
		var targetValue = [];
		
		elms.map(function(elm) {
			if (elm.checked) {
				targetValue.push(elm.value);
			}
			return true;
		});
		
		setModalSelectedAddon(targetValue);
	}
	
var addToCart = (event) => {
  event.preventDefault();

  if (!selectedCapster) {
    alert("Pilih capster terlebih dahulu!");
    return;
  }

  const capster = capsters.find(
    (c) => String(c.id) === String(selectedCapster)
  );

  if (!capster || !modalData) return;

  modal.hide();

  setTimeout(() => {
    setOrderData(prev => [
      ...prev,
      {
        id: Date.now(),
        layananId: modalData.id,
        image: modalData.image,
        title: modalData.title,
        price: modalData.price,
        quantity: modalQuantity,
        capsterId: capster.id,
        capsterName: capster.nama
      }
    ]);
  }, 300);
};

useEffect(() => {
  async function fetchCapster() {
    const res = await getCapsterAPI(user?.cabangId);
    if (res.success) {
      setCapsters(res.data);
    }
  }

  if (user?.cabangId) {
    fetchCapster();
  }
}, [user]);
  
	useEffect(() => {
		// 1. Sembunyikan Header & Sidebar Dashboard
		context.handleSetAppHeaderNone(true);
		context.handleSetAppSidebarNone(true);
		context.handleSetAppContentFullHeight(true);
		context.handleSetAppContentClass('p-0');

		// 2. INISIALISASI MODAL (Penting agar tidak error 'undefined')
		const modalElement = document.getElementById('modalPosItem');
		if (modalElement) {
			const modalInstance = new Modal(modalElement);
			setModal(modalInstance);
		}

		// 3. Load Data API
		const loadData = async () => {
			const result = await getLayananAPI(user?.cabangId);
			if (result.success) {
				setTableData(result);
			}
		};
		loadData();

		// Clean up saat pindah halaman
		return function cleanUp() {
			context.handleSetAppHeaderNone(false);
			context.handleSetAppSidebarNone(false);
			context.handleSetAppContentFullHeight(false);
			context.handleSetAppContentClass('');
		}
		// eslint-disable-next-line
	}, [user, context]);

	const handleGoToPayment = () => {
	setPosMobileSidebarToggled(false);

	navigate('/pos/customer-payment', {
		state: {
		orderData,
		total: Number(getSubTotalPrice())
		}
	});
	};
	
return (
  <>
    <div className={'pos pos-with-menu pos-with-sidebar ' + ((posMobileSidebarToggled) ? 'pos-sidebar-mobile-toggled' : '')} id="pos">
      
      {/* 1. MENU SAMPING (KATEGORI) */}
      <div className="pos-menu">
        <div className="logo">
          <Link to="/">
            <div className="logo-img"><i className="fa fa-cut"></i></div>
            <div className="logo-text">Kedai Tjoekoer MANA</div>
          </Link>
        </div>
        <div className="nav-container">
          <PerfectScrollbar className="h-100">
            <ul className="nav nav-tabs">
              {tableData?.category?.map((category, index) => (
                <li className="nav-item" key={index}>
                  <a className={'nav-link' + ((category.type === categoryType) ? ' active' : '')} 
                     onClick={(event) => showType(event, category.type)} href="#/">
                    <div className="nav-icon"><i className={category.icon}></i></div>
                    <div className="nav-text">{category.text}</div>
                  </a>
                </li>
              ))}
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    
      {/* 2. KONTEN TENGAH (DAFTAR LAYANAN) */}
      <div className="pos-content">
        <div className="pos-content-container h-100">
          <PerfectScrollbar className="h-100 p-3">
            <div className="product-row">
              {tableData?.food?.map((food, index) => (
                <div className={'product-container'+ ((food.hide) ? ' d-none' : '')} key={index}>
                  <a href="#/" className={'product'+ ((!food.available) ? ' not-available': '')} 
                     onClick={(event) => showPosItemModal(event, food)}>
                    <div className="img" style={{backgroundImage: `url(${food.image})`}}></div>
                    <div className="text">
                      <div className="title">{food.title}</div>
                      <div className="desc">{food.description}</div>
                      <div className="price">Rp {parseFloat(food.price).toLocaleString('id-ID')}</div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </PerfectScrollbar>
        </div>

        {/* Floating Button untuk Mobile */}
        <div className="d-block d-lg-none" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1020 }}>
          <button className="btn btn-theme btn-lg rounded-pill shadow-lg" onClick={toggleMobileSidebar}>
            <Icon icon="heroicons-outline:shopping-cart" className="me-2" />
            Keranjang ({getOrderTotal()})
          </button>
        </div>
      </div>

      {/* 3. SIDEBAR KANAN (RINGKASAN PESANAN) */}
      <div className="pos-sidebar" id="pos-sidebar">
        <div className="pos-sidebar-header">
          <button className="btn-close" onClick={dismissMobileSidebar}></button>
          <div className="title">Pesanan Baru</div>
          <div className="order">Item: <b>{getOrderTotal()}</b></div>
        </div>
        
        <div className="pos-sidebar-body">
          <PerfectScrollbar className="h-100">
            {orderData.length > 0 ? (
              orderData.map((item, index) => (
                <div className="pos-order" key={index}>
                  <div className="pos-order-product">
                    <div className="img" style={{backgroundImage: `url(${item.image})`}}></div>
                    <div className="flex-1">
                      <div className="h6 mb-1">{item.title}</div>
					  <div className="small text-muted">
  Capster: {item.capsterName}
</div>
                      <div className="small text-muted">Rp {parseFloat(item.price).toLocaleString('id-ID')}</div>
                      <div className="d-flex mt-2 align-items-center">
                        <button onClick={(e) => deductQty(e, item.id)} className="btn btn-secondary btn-xs">-</button>
                        <input type="text" className="form-control form-control-sm w-40px mx-2 text-center p-0" readOnly value={item.quantity} />
                        <button onClick={(e) => addQty(e, item.id)} className="btn btn-secondary btn-xs">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="pos-order-price d-flex flex-column justify-content-between">
                    <div className="text-end fw-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                    <div className="text-end">
                      <button onClick={(e) => removeOrder(e, item.id)} className="btn btn-default btn-xs text-danger border-0">
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                <Icon icon="heroicons-outline:shopping-bag" fontSize="48px" className="mb-2 opacity-2" />
                <div>Keranjang kosong</div>
              </div>
            )}
          </PerfectScrollbar>
        </div>

		<div className="pos-sidebar-footer">
			<hr />

			<div className="d-flex align-items-center mb-3">
				<div className="h4 mb-0">Total Harga</div>
				<div className="flex-1 text-end h4 mb-0 text-theme">
				Rp {parseFloat(getSubTotalPrice()).toLocaleString('id-ID')}
				</div>
			</div>

			<div className="mt-3">
				<button
				className="btn btn-theme btn-lg w-100 rounded-3 fw-bold py-3"
				disabled={orderData.length === 0}
				onClick={handleGoToPayment}
				>
				PROSES PEMBAYARAN
				</button>
			</div>
		</div>
		
      </div>
    </div>

	{/* Taruh ini di paling bawah sebelum penutup return fragment </> */}
	<div className="modal modal-pos fade" id="modalPosItem">
		<div className="modal-dialog modal-lg">
			<div className="modal-content">
			{modalData && (
				<div className="modal-body p-0">
				<button className="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>
				<div className="modal-pos-product">
					<div className="modal-pos-product-img">
						<div className="img" style={{backgroundImage: `url(${modalData.image})`}}></div>
					</div>

					<div className="modal-pos-product-info">
						<hr />

						{/* PILIH CAPSTER */}
						<div className="mb-3">
						<label className="form-label fw-bold">Pilih Capster</label>
						<select
							className="form-select"
							value={selectedCapster}
							onChange={(e) => setSelectedCapster(e.target.value)}
						>
							<option value="">-- Pilih Capster --</option>
							{capsters.map((c) => (
							<option key={c.id} value={c.id}>
								{c.nama}
							</option>
							))}
						</select>
						</div>

						{/* JUMLAH */}
						<div className="d-flex align-items-center mb-3">
						<div className="fw-bold me-3">Jumlah:</div>
						<button className="btn btn-secondary" onClick={deductModalQty}>-</button>
						<input
							type="text"
							className="form-control w-50px mx-2 text-center"
							readOnly
							value={modalQuantity}
						/>
						<button className="btn btn-secondary" onClick={addModalQty}>+</button>
						</div>

						<button
						className="btn btn-theme btn-lg w-100 rounded-pill"
						onClick={addToCart}
						disabled={!selectedCapster}
						>
						Tambah ke Keranjang
						</button>
					</div>
				</div>
				</div>
			)}
			</div>
		</div>
	</div>

  </>
);


}

export default PosCustomerOrder;