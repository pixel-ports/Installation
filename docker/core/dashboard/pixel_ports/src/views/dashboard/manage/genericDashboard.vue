<template>
<div class="app-container" :style="bgc">
  <!--<div id="app" class="app-container">-->
    <div class="filter-container">
      <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfDashboards">
        {{ $t('resources.back') }}
      </el-link>
      <el-button class="filter-item" style="float:right;margin-bottom:10px;" type="primary" icon="el-icon-bottom" @click="createPDF()">
        <!--getPDF-->
        {{ $t('resources.downloadPDF') }}
      </el-button>
    </div>
    <div id="document" class="container">
      <GridView />
    </div>
    <div class="filter-container" style="margin-top:10px;">
      <el-link type="primary" icon="el-icon-arrow-left" @click="gotoListOfDashboards">
        {{ $t('resources.back') }}
      </el-link>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
const fs = require('fs')
// import fs from 'fs'
import jsPDF from 'jspdf'
// import { mapActions } from 'vuex'
import GridView from '@/components/GridEditor/GridView'
// import { dashboardGet } from '@/api/dashboard'
import axios from 'axios'
export default {
  name: 'Home',
  components: { GridView },
  data() {
    return {
      bgc: {
        backgroundColor: 'rgb(240,242,245)',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'absolute'
      },
      base64Img: null,
      margins: {
        top: 70,
        bottom: 40,
        left: 30,
        width: 550
      }
    }
  },
  computed: {
    idDashboard() {
      var idDashboard = this.$route.params.id
      return idDashboard
    }
  },
  created() {
    // this.recoverDashboard()
    // this.fetchResources()
    /* this.imgToBase64('Logo.png', function(base64) {
      this.base64Img = base64
      console.log(this.base64Img)
    })*/
  },
  methods: {
    /* async loop() {

    },*/
    piruli() {
      console.log('piruli')
      html2canvas(document.getElementById('document'), {
        onrendered: function(canvas) {
          console.log('pirulo')
          var img = canvas.toDataURL('image/png')
          var doc = new jsPDF()
          doc.addImage(img, 'JPEG', 20, 20)
          doc.save('piruli.pdf')
        }
      })
    },
    chachi() {
      console.log('veremos')
      html2canvas(document.getElementById('document'), {
        onrendered: function(canvas) {
          console.log('ENTRE')
          var pageData = canvas.toDataURL('image/jpeg', 1.0)
          console.log('Aqui estoy')
          var pdf = new jsPDF('', 'pt', 'a4')

          pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28 / canvas.width * canvas.height)

          pdf.save('stone.pdf')
        }
      })
    },
    headerPDF(doc) {
      doc.setFontSize(30)
      doc.setTextColor(40)
      doc.setFontStyle('normal')
      // var imgData = 'data:image/png;base64,' + this.base64_encode('Logo.png')
      // doc.addImage(imgData, 'PNG', 15, 40, 180, 160)
      doc.text('Report Header Template', this.margins.left + 50, 40)

      doc.line(3, 70, this.margins.width + 43, 70) // horizontal line
    },
    newTry() {
      var resources = this.$store.getters.getResources
      console.log('Hola')
      console.log(resources)
      // var pdf = new jsPDF('p', 'pt', 'a4')
      var pdf = new jsPDF('p', 'cm', 'a4')
      pdf.setFontSize(18)
      /* pdf.fromHTML(document.getElementById('document'), this.margins.left, this.margins.top,
        {
          width: this.margins.width
        },
        this.headerFooterFormatting(pdf),
        this.margins)*/
      // this.headerFooterFormatting(pdf)
      // var x = 150
      resources.forEach(resource => {
        // if (resource.type === 'title') {
        // pdf.text(resource.x, resource.y, resource.title)
        pdf.rect(resource.x, resource.y, resource.w, resource.h)
        // }
      })

      pdf.save('raimon.pdf')
    },
    test() {
      html2canvas(document.getElementById('document')).then(canvas => {
        var imgData = canvas.toDataURL('image/png')
        var doc = new jsPDF('p', 'pt')

        var header = function(data) {
          doc.setFontSize(18)
          doc.setTextColor(40)
          doc.setFontStyle('normal')
          // doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);

          doc.text('Testing Report', data.settings.margin.left, 50)
        }
        var options = {
          beforePageContent: header,
          margin: {
            top: 80
          },
          startY: 100 + 20
        }
        doc.addImage(imgData, 'PNG', options)
        doc.save('table.pdf')
      })
    },
    newPDF() {
      var useWidth = document.getElementById('document').style.width
      var useHeight = document.getElementById('document').style.height

      html2canvas(document.getElementById('document'), {
        width: useWidth,
        height: useHeight,
        onrendered: function(canvas) {
        // you should get a canvas that includes the entire element -- not just the visible portion
          var doc = new jsPDF('p', 'mm')
          //
          var pageData = canvas.toDataURL('image/jpeg', 1.0)
          doc.addImage(pageData, 'JPEG', 0, 0, useWidth, useHeight)
          doc.save('file.pdf')
          //
        }
      })
    },
    addFooter(doc, pageNumber, totalPages) {
      var str = 'Page ' + pageNumber + ' of ' + totalPages

      doc.setFontSize(10)
      doc.text(str, this.margins.left, doc.internal.pageSize.height - 20)
    },
    createPDF() {
      html2canvas(document.getElementById('document'), { allowTaint: false, dpi: 300, scale: 3 }).then(canvas => {
      // html2canvas(document.getElementById('document')).then(canvas => {
        var imgData = canvas.toDataURL('image/png')
        var imgWidth = 210
        var pageHeight = 295
        var imgHeight = canvas.height * imgWidth / canvas.width
        var heightLeft = imgHeight
        var doc = new jsPDF('p', 'mm')
        var totalPages = doc.internal.getNumberOfPages()
        var position = 0
        var pageNumber = 1
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        this.addFooter(doc, pageNumber, totalPages)
        pageNumber++
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          doc.addPage()
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
          this.addFooter(doc, pageNumber, totalPages)
          pageNumber++
        }

        doc.setProperties({
          title: 'Title',
          subject: 'This is the subject',
          author: 'PIXEL',
          keywords: 'Generated, jsPDF, PIXEL Platform',
          creator: 'Jose Clemente'
        })

        doc.save('file.pdf')
      })
    },
    getPDF() {
      html2canvas(document.getElementById('document'), { allowTaint: false, dpi: 300, scale: 3 }).then(function(canvas) {
        // canvas.getContext('2d')
        var HTML_Width = canvas.width
        var HTML_Height = canvas.height
        var top_left_margin = 0
        var PDF_Width = HTML_Width + (top_left_margin * 2)
        var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2)
        var canvas_image_width = HTML_Width
        var canvas_image_height = HTML_Height
        var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1
        console.log(canvas.height + '  ' + canvas.width)
        var imgData = canvas.toDataURL('image/jpeg')//, 1.0)
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height])
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height)

        for (var i = 1; i <= totalPDFPages; i++) {
          pdf.addPage(PDF_Width, PDF_Height)
          pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height)
        }

        pdf.save('HTML-Document.pdf')
      })
    },
    imgToBase64(url, callback, imgVariable) {
      console.log('Entro en imgToBase64')
      console.log('url: ' + url)
      console.log('callback: ' + callback)
      console.log('imgVariable: ' + imgVariable)
      console.log(window.FileReader)
      if (!window.FileReader) {
        callback(null)
        return
      }
      var xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onload = function() {
        var reader = new FileReader()
        reader.onloadend = function() {
          imgVariable = reader.result.replace('text/xml', 'image/jpeg')
          callback(imgVariable)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', url)
      xhr.send()
    },
    download2() {
      html2canvas(document.getElementById('document')).then(canvas => {
        var pdf = new jsPDF()
        pdf.addHTML(canvas, { pagesplit: true, retina: true }, function() {
          pdf.save('raimon.pdf')
        })
      })
    },
    download_good() {
      var fileName = prompt('What name do you want to put on pdf?')
      html2canvas(document.getElementById('document'), { imageTimeout: 5000, useCORS: true, allowTaint: true, logging: true }).then(canvas => {
        // document.getElementById('results').appendChild(canvas)
        const img = canvas.toDataURL('image/png')

        // img.crossOrigin = 'use-credentials' // 'anonymous'
        /*eslint-disable */
        //const doc = new jsPDF('portrait', 'mm', 'a3')
        const doc = new jsPDF('landscape')
        /*eslint -enable */
        // const doc = new jsPDF('p', 'pt', 'a4')
        var width = doc.internal.pageSize.getWidth()
        var height = doc.internal.pageSize.getHeight()
        doc.addImage(img, 'JPEG', 0, 0, width, height)
        /* if (height > 365) {
          doc.addPage()
          doc.addImage(img, 'JPEG', 0, -365, width, height)
        } */
        doc.setProperties({
          title: 'Title',
          subject: 'This is the subject',
          author: 'PIXEL',
          keywords: 'Generated, jsPDF, PIXEL Platform',
          creator: 'Jose Clemente'
        })
        doc.save(fileName + '.pdf')
      })
    },
    generatePDF() {
      var fileName = prompt(this.$t('common.namePDF'))
      html2canvas(document.getElementById('document'), { imageTimeout: 5000, useCORS: true, allowTaint: true, logging: true }).then(canvas => {
        var pdf = new jsPDF('p', 'pt', 'a4')
        pdf.setFontSize(18)
        var totalPages = pdf.internal.getNumberOfPages()
        for (var i = totalPages; i >= 1; i--) {
          pdf.setPage(i)

          this.headerPDF(pdf)

          const img = canvas.toDataURL('image/png')
          var width = pdf.internal.pageSize.getWidth()
          var height = pdf.internal.pageSize.getHeight()
          pdf.addImage(img, 'JPEG', 0, 0, width, height)
          // pdf.addHTML(canvas, { pagesplit: true, retina: true })

          this.footerPDF(pdf, i, totalPages)
          pdf.page++
        }
        pdf.setProperties({
          title: 'Title',
          subject: 'This is the subject',
          author: 'PIXEL',
          keywords: 'Generated, jsPDF, PIXEL Platform',
          creator: 'Jose Clemente'
        })
        pdf.save(fileName + '.pdf')
      })
    },
    headerPDF(doc) {
      doc.setFontSize(30)
      doc.setTextColor(40)
      doc.setFontStyle('normal')
      // var imgData = 'data:image/png;base64,' + this.base64_encode('Logo.png')
      // doc.addImage(imgData, 'PNG', 15, 40, 180, 160)
      doc.text('Report Header Template', this.margins.left + 50, 40)

      doc.line(3, 70, this.margins.width + 43, 70) // horizontal line
    },
    footerPDF(doc, pageNumber, totalPages) {
      var str = 'Page ' + pageNumber + ' of ' + totalPages

      doc.setFontSize(10)
      doc.text(str, this.margins.left, doc.internal.pageSize.height - 20)
    },
    newGeneration() {
      console.log('newGeneration')
      var pdf = new jsPDF()
      pdf.setFontSize(18)
      pdf.fromHTML(document.getElementById('document'), this.margins.left, this.margins.top,
        {
          width: this.margins.width
        },
        this.formatPDF(pdf),
        this.margins)
    },
    formatPDF(doc) {
      console.log('formatPDF async')
      var totalPages = doc.internal.getNumberOfPages()
      console.log('Number of pages: ' + totalPages)
      //for (var i = 1; i <= totalPDFPages; i++) {
      for (var i = 0; i < totalPages; i++) {
        console.log('Entro al bucle for')
        console.log(doc[i])
        /*new Promise(function(resolve) {*/
          /*html2canvas(doc.setPage(i), { scale: 1}).then(function(canvas) {
            var img = canvas.toDataURL('image/png')
            doc.addImage(img, 'JPEG', 10, 10)
            if ((i + 1) == totalPages.length) {
              doc.save('menu.pdf')
            } else {
              doc.addPage()
            }
            //resolve()
          })*/
        /*})*/
      }
    },
    generate() {
      var pdf = new jsPDF('p', 'pt', 'a4')
      pdf.setFontSize(18)
      pdf.fromHTML(document.getElementById('document'), this.margins.left, this.margins.top,
        {
          width: this.margins.width
        },
        this.headerFooterFormatting(pdf),
        this.margins)
      pdf.save('raimon.pdf')
      /* var iframe = document.createElement('iframe')
      iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;')
      document.body.appendChild(iframe)

      iframe.src = pdf.output('datauristring')*/
    },
    headerFooterFormatting(doc) {
      // return ''
      var totalPages = doc.internal.getNumberOfPages()
      console.log('header')
      for (var i = totalPages; i >= 1; i--) { // make this page, the current page we are currently working on.
        doc.setPage(i)

        this.header(doc)

        this.footer(doc, i, totalPages)
        doc.page++
      }
    },
    header(doc) {
      doc.setFontSize(30)
      doc.setTextColor(40)
      doc.setFontStyle('normal')
      //var imgData = 'data:image/png;base64,' + this.base64_encode('Logo.png')
      //doc.addImage(imgData, 'PNG', 15, 40, 180, 160)

      //console.log('Contenido de base64Img')
      //console.log(this.base64Img)
      /*if (this.base64Img) {
        console.log('Pinto la imagen')
        doc.addImage(this.base64Img, 'JPEG', this.margins.left, 10, 40, 40)
      }*/
      doc.text(this.margins.left + 50, 40, 'Report Header Template')
      //doc.text('Report Header Template', this.margins.left + 50, 40)

      doc.line(3, 70, this.margins.width + 43, 70) // horizontal line
    },
    base64_encode(file) {
      // console.log(fs)
      var bitmap = fs.readFileSync(file)
      return new Buffer(bitmap).toString('base64')
    },
    footer(doc, pageNumber, totalPages) {
      var str = 'Page ' + pageNumber + ' of ' + totalPages

      doc.setFontSize(10)
      doc.text(str, this.margins.left, doc.internal.pageSize.height - 20)
    },
    printToPDF() {
      var endpoint = 'https://v2018.api2pdf.com/chrome/html'
      var apikey = 'fdceab82-32cb-4ae3-9e9b-de734cf598f5'
      var config = {
        headers: {
          Authorization: apikey
        }
      }
      var payload = {
        html: document.getElementById('document'), // Use your own HTML
        inlinePdf: true
      }
      axios.post(endpoint, payload, config).then(function(response) {
        console.log(response.data.pdf)
      }).catch(function(error) {
        console.log(error)
      })
    },
    /* ...mapActions({
      fetchResources: 'fetchResources'
    }) */
    /* recoverDashboard() {
      console.log('Id de Dashboard')
      console.log(this.idDashboard)
      if (this.idDashboard != null) {
        console.log('Edición / Visualización de un dashboard existente')
        this.$store.commit('setisNewDashboard', false)
        dashboardGet(this.idDashboard).then(response => {
          console.log('GET DASHBOARD')
          console.log(response.data.definition.dashboard)
          this.$store.commit('setResources', response.data.definition.dashboard)
          this.$store.commit('setTitleDashboard', response.data.title)
          this.$store.commit('setCurrentDashboard', response.data)
        }).catch(() => {
          console.log('Error')
        })
      } else {
        console.log('Creación de un nuevo dashboard')
        this.$store.commit('setResources', [])
        this.$store.commit('setisNewDashboard', true)
      }
    },*/
    gotoListOfDashboards() {
      this.$router.push({ name: 'dasbhoard' })
    },
    download3() {
      var doc = new jsPDF('portrait', 'pt', 'a4', true)
      var elementHandler = {
        '#ignorePDF': function(element, renderer) {
          return true
        }
      }
      var source = document.getElementById('document')
      doc.fromHTML(source, 15, 15, {
        'width': 560,
        'elementHandlers': elementHandler
      })
      var svg = document.querySelector('svg')
      var canvas = document.createElement('canvas')
      var canvasIE = document.createElement('canvas')
      var context = canvas.getContext('2d')
      var DOMURL = window.URL || window.webkitURL || window
      var data = (new XMLSerializer()).serializeToString(svg)
      canvg(canvas, data)
      var svgBlob = new Blob([data], {
        type: 'image/svg+xml;charset=utf-8'
      })
    },
    download_goodApproach() {
      html2canvas(document.getElementById('document')).then(canvas => {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
  
        //The height of the canvas which one pdf page can show;
        var pageHeight = contentWidth / 592.28 * 841.89;
        //the height of canvas that haven't render to pdf
        var leftHeight = contentHeight;
        //addImage y-axial offset
        var position = 0;
        //a4 format [595.28,841.89]	      
        var imgWidth = 595.28;
        var imgHeight = 592.28/contentWidth * contentHeight;

        var pageData = canvas.toDataURL('image/jpeg', 1.0);
  
        var pdf = new jsPDF('', 'pt', 'a3');
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
        } else {
          while(leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 841.89;
            //avoid blank page
            if(leftHeight > 0) {
                pdf.addPage();
            }
          }
        }
        pdf.save('content.pdf');
      })
    },
    download_notFullyGood() {
      html2canvas(document.getElementById('document')).then(canvas => {
        //$("#previewBeforeDownload").html(canvas);
        var imgData = canvas.toDataURL("image/jpeg",1);
        var pdf = new jsPDF("p", "mm", "a3");
        var pageWidth = pdf.internal.pageSize.getWidth();
        var pageHeight = pdf.internal.pageSize.getHeight();
        var imageWidth = canvas.width;
        var imageHeight = canvas.height;

        var ratio = imageWidth/imageHeight >= pageWidth/pageHeight ? pageWidth/imageWidth : pageHeight/imageHeight;
        //pdf = new jsPDF(this.state.orientation, undefined, format);
        pdf.addImage(imgData, 'JPEG', 0, 0, imageWidth * ratio, imageHeight * ratio);
        pdf.save("invoice.pdf");
      });
    },
    download_width() {
      console.log('thor')
      var w = document.getElementById('document').offsetWidth
      var h = document.getElementById('document').offsetHeight
      html2canvas(document.getElementById('document')).then(canvas => {
          var img = canvas.toDataURL('image/jpeg', 1)
          var doc = new jsPDF('L', 'px', [w, h])
          doc.addImage(img, 'JPEG', 0, 0, w, h)
          doc.save('sampleGood.pdf')
      })
    },
    download() {
      console.log('chacho')
      var w = document.getElementById('document').offsetWidth
      var h = document.getElementById('document').offsetHeight
      var quotes = document.getElementById('document')
      html2canvas(document.getElementById('document')).then(canvas => {
          console.log('aqui ando')
          //! MAKE YOUR PDF
          var pdf = new jsPDF('L', 'px', [w, h])
          //var pdf = new jsPDF('p', 'pt', 'letter') // original
          for (var i = 0; i <= quotes.clientHeight/980; i++) {
            //! This is all just html2canvas stuff
            var srcImg  = canvas
            var sX      = 0
            var sY      = 980*i // start 980 pixels down for every new page
            var sWidth  = 900
            var sHeight = 980
            var dX      = 0
            var dY      = 0
            var dWidth  = 900
            var dHeight = 980

            window.onePageCanvas = document.createElement('canvas')
            onePageCanvas.setAttribute('width', 900)
            onePageCanvas.setAttribute('height', 980)
            var ctx = onePageCanvas.getContext('2d')
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight)

            // document.body.appendChild(canvas);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0)

            var width         = onePageCanvas.width
            var height        = onePageCanvas.clientHeight

            //! If we're on anything other than the first page,
            // add another page
            if (i > 0) {
                pdf.addPage(612, 791) //8.5" x 11" in pts (in*72)
            }
            //! now we declare that we're working on that page
            pdf.setPage(i+1)
            //! now we add content to that page!
            pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62))

          }
          //! after the for loop is finished running, we save the pdf.
          pdf.save('test.pdf')
      })
    }
  }
}
</script>
