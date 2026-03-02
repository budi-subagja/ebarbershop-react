import React, { useState } from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { Link, Navigate } from 'react-router-dom'; // Tambahkan Navigate
import { Panel, PanelHeader, PanelFooter } from './../../components/panel/panel.jsx';
import { AppSettings } from './../../config/app-settings.js';

function DashboardV3() {	
    const { user } = useAuth();
    const role = user?.role?.toUpperCase();

    // 1. PROTEKSI ADMIN: Jika role adalah ADMIN, arahkan langsung ke POS
    if (role === 'ADMIN') {
        return <Navigate to="/pos/customer-order" replace />;
    }

	return (
		<div>
			<ol className="breadcrumb float-xl-end">
				<li className="breadcrumb-item"><Link to="/">Home</Link></li>
				<li className="breadcrumb-item active">Dashboard</li>
			</ol>
			<h1 className="page-header">
				{role === 'OWNER' ? 'Executive Dashboard' : `Dashboard ${user?.nama}`} 
				<small> Kedai Tjoekoer MANA</small>
			</h1>
			<div className="row">
				{/* Widget 1: Profit - Hanya muncul untuk Owner */}
				{role === 'OWNER' && (
					<div className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-blue">
							<div className="stats-icon stats-icon-lg"><i className="fa fa-dollar-sign fa-fw"></i></div>
							<div className="stats-content">
								<div className="stats-title">TOTAL PROFIT (ALL)</div>
								<div className="stats-number">Rp 180.200</div>
								<div className="stats-desc">Pendapatan seluruh outlet</div>
							</div>
						</div>
					</div>
				)}
				{/* Widget 2: Orders - Muncul untuk Owner (Semua) atau Capster (Miliknya sendiri) */}
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-indigo">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-archive fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">
								{role === 'OWNER' ? 'TOTAL ORDERS' : 'MY ORDERS TODAY'}
							</div>
							<div className="stats-number">38</div>
							<div className="stats-desc">Total antrian selesai</div>
						</div>
					</div>
				</div>
				{/* BAGIAN 2: DETAIL TAMPILAN BAWAH */}
				<div className="row">
					{role === 'OWNER' ? (
						<div className="col-xl-12">
							{/* Tampilkan Grafik Analisa untuk Owner */}
							<div className="alert alert-info">Menampilkan Analitik Seluruh Capster.</div>
						</div>
					) : (
						<div className="col-xl-12">
							{/* Tampilkan List Pekerjaan Hari ini untuk Capster */}
							<div className="alert alert-success">Halo {user?.nama}, berikut adalah performa cukur Anda hari ini.</div>
						</div>
					)}
				</div>

				{/* Anda bisa menambahkan widget lainnya di sini */}
			

				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-teal">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-globe fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">TODAY'S VISITS</div>
							<div className="stats-number">7,842,900</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '70.1%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (70.1%)</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-blue">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-dollar-sign fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">TODAY'S PROFIT</div>
							<div className="stats-number">180,200</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '40.5%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (40.5%)</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-indigo">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-archive fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">NEW ORDERS</div>
							<div className="stats-number">38,900</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '76.3%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (76.3%)</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6">
					<div className="widget widget-stats bg-dark">
						<div className="stats-icon stats-icon-lg"><i className="fa fa-comment-alt fa-fw"></i></div>
						<div className="stats-content">
							<div className="stats-title">NEW COMMENTS</div>
							<div className="stats-number">3,988</div>
							<div className="stats-progress progress">
								<div className="progress-bar" style={{width: '54.9%'}}></div>
							</div>
							<div className="stats-desc">Better than last week (54.9%)</div>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xl-6">
				<div className="row">
					<div className="col-sm-6">
						<div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
							<div className="card-body">
								<div className="mb-3 text-gray-500">
									<b className="mb-3">CONVERSION RATE</b> 
									<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Conversion Rate" data-bs-placement="top" data-bs-content="Percentage of sessions that resulted in orders from total number of sessions." data-original-title="" title=""></i></span>
								</div>
								<div className="d-flex align-items-center mb-1">
									<h2 className="text-white mb-0">2.19%</h2>
									<div className="ms-auto">
									</div>
								</div>
								<div className="mb-4 text-gray-500 ">
									<i className="fa fa-caret-down"></i> 0.50% compare to last week
								</div>
								<div className="d-flex mb-2">
									<div className="d-flex align-items-center">
										<i className="fa fa-circle text-red fs-8px me-2"></i>
										Added to cart
									</div>
									<div className="d-flex align-items-center ms-auto">
										<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 262%</div>
										<div className="w-50px text-end ps-2 fw-bold">3.79%</div>
									</div>
								</div>
								<div className="d-flex mb-2">
									<div className="d-flex align-items-center">
										<i className="fa fa-circle text-warning fs-8px me-2"></i>
										Reached checkout
									</div>
									<div className="d-flex align-items-center ms-auto">
										<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 11%</div>
										<div className="w-50px text-end ps-2 fw-bold">3.85%</div>
									</div>
								</div>
								<div className="d-flex">
									<div className="d-flex align-items-center">
										<i className="fa fa-circle text-lime fs-8px me-2"></i>
										Sessions converted
									</div>
									<div className="d-flex align-items-center ms-auto">
										<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 57%</div>
										<div className="w-50px text-end ps-2 fw-bold">2.19%</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-sm-6">
						<div className="card border-0 text-truncate mb-3 bg-gray-800 text-white">
							<div className="card-body">
								<div className="mb-3 text-gray-500">
									<b className="mb-3">STORE SESSIONS</b> 
									<span className="ms-2"><i className="fa fa-info-circle" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-title="Store Sessions" data-bs-placement="top" data-bs-content="Number of sessions on your online store. A session is a period of continuous activity from a visitor." data-original-title="" title=""></i></span>
								</div>
								<div className="d-flex align-items-center mb-1">
									<h2 className="text-white mb-0">70,719</h2>
									<div className="ms-auto">
									</div>
								</div>
								<div className="mb-4 text-gray-500 ">
									<i className="fa fa-caret-up"></i> 9.5% compare to last week
								</div>
								<div className="d-flex mb-2">
									<div className="d-flex align-items-center">
										<i className="fa fa-circle text-teal fs-8px me-2"></i>
										Mobile
									</div>
									<div className="d-flex align-items-center ms-auto">
										<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 25.7%</div>
										<div className="w-50px text-end ps-2 fw-bold">53,210</div>
									</div>
								</div>
								<div className="d-flex mb-2">
									<div className="d-flex align-items-center">
										<i className="fa fa-circle text-blue fs-8px me-2"></i>
										Desktop
									</div>
									<div className="d-flex align-items-center ms-auto">
										<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 16.0%</div>
										<div className="w-50px text-end ps-2 fw-bold">11,959</div>
									</div>
								</div>
								<div className="d-flex">
									<div className="d-flex align-items-center">
										<i className="fa fa-circle text-aqua fs-8px me-2"></i>
										Tablet
									</div>
									<div className="d-flex align-items-center ms-auto">
										<div className="text-gray-500 small"><i className="fa fa-caret-up"></i> 7.9%</div>
										<div className="w-50px text-end ps-2 fw-bold">5,545</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default DashboardV3;