import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductAdminComponent } from '../product/product-admin/product-admin.component';
import { ProductCreateComponent } from '../product/productcreate/productcreate.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductEditComponent } from '../product/productedit/productedit.component';
import { TopSellingProductsComponent } from '../top-selling-products/top-selling-products.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule], // Thêm CommonModule
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  private globalStyles: HTMLLinkElement[] = [];

  ngOnInit() {
    this.removeGlobalStyles();
    this.loadStyles();
    this.loadScripts();
  }

  ngOnDestroy() {
    this.restoreGlobalStyles();
  }

  removeGlobalStyles() {
    const globalCssPaths = [
      "node_modules/bootstrap/dist/css/bootstrap.min.css",
      "assets/static/fe/vendor/line-awesome/line-awesome/line-awesome/css/line-awesome.min.css",
      "assets/static/fe/css/bootstrap.min.css",
      "assets/static/fe/css/plugins/owl-carousel/owl.carousel.css",
      "assets/static/fe/css/plugins/magnific-popup/magnific-popup.css",
      "assets/static/fe/css/plugins/jquery.countdown.css",
      "assets/static/fe/css/style.css",
      "assets/static/fe/css/skins/skin-demo-2.css",
      "assets/static/fe/css/demos/demo-2.css"
    ];

    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const linkElement = link as HTMLLinkElement;
      console.log("Found CSS:", linkElement.href); // Debug danh sách CSS có trong DOM

      if (globalCssPaths.some(cssPath => linkElement.href.includes(cssPath))) {
        console.log("Removing:", linkElement.href); // Debug xem có file nào được xóa không
        this.globalStyles.push(linkElement);
        linkElement.remove();
      }
    });

    console.log("Remaining styles:", document.querySelectorAll('link[rel="stylesheet"]'));
  }



  // removeGlobalStyles() {
  //   const globalCssPaths = [
  //     "node_modules/bootstrap/dist/css/bootstrap.min.css",
  //     "assets/static/fe/vendor/line-awesome/line-awesome/line-awesome/css/line-awesome.min.css",
  //     "assets/static/fe/css/bootstrap.min.css",
  //     "assets/static/fe/css/plugins/owl-carousel/owl.carousel.css",
  //     "assets/static/fe/css/plugins/magnific-popup/magnific-popup.css",
  //     "assets/static/fe/css/plugins/jquery.countdown.css",
  //     "assets/static/fe/css/style.css",
  //     "assets/static/fe/css/skins/skin-demo-2.css",
  //     "assets/static/fe/css/demos/demo-2.css"
  //   ];

  //   document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
  //     const linkElement = link as HTMLLinkElement; // Cast về đúng kiểu
  //     if (globalCssPaths.some(path => linkElement.href.includes(path))) {
  //       this.globalStyles.push(linkElement);
  //       linkElement.remove();
  //     }
  //   });

  // }

  restoreGlobalStyles() {
    this.globalStyles.forEach(link => document.head.appendChild(link));
  }

  loadStyles() {
    const styles = [
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
      'assets/admin/plugins/fontawesome-free/css/all.min.css',
      'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
      'assets/admin/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
      'assets/admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
      'assets/admin/plugins/jqvmap/jqvmap.min.css',
      'assets/admin/dist/css/adminlte.min.css',
      'assets/admin/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
      'assets/admin/plugins/daterangepicker/daterangepicker.css',
      'assets/admin/plugins/summernote/summernote-bs4.min.css'
    ];

    styles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  loadScripts() {
    const scripts = [
      'assets/admin/plugins/jquery/jquery.min.js',
      'assets/admin/plugins/jquery-ui/jquery-ui.min.js',
      'assets/admin/plugins/bootstrap/js/bootstrap.bundle.min.js',
      'assets/admin/plugins/chart.js/Chart.min.js',
      'assets/admin/plugins/sparklines/sparkline.js',
      'assets/admin/plugins/jqvmap/jquery.vmap.min.js',
      'assets/admin/plugins/jqvmap/maps/jquery.vmap.usa.js',
      'assets/admin/plugins/jquery-knob/jquery.knob.min.js',
      'assets/admin/plugins/moment/moment.min.js',
      'assets/admin/plugins/daterangepicker/daterangepicker.js',
      'assets/admin/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
      'assets/admin/plugins/summernote/summernote-bs4.min.js',
      'assets/admin/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
      'assets/admin/dist/js/adminlte.js',
      'assets/admin/dist/js/demo.js',
      'assets/admin/dist/js/pages/dashboard.js'
    ];

    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });

    // Fix jQuery UI tooltip conflict
    setTimeout(() => {
      (window as any).$?.widget?.bridge?.('uibutton', (window as any).$.ui.button);
    }, 1000);
  }
}
