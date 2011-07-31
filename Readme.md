Generic content embed code
==========================

This is a version of the Meebo Bar embed code that allows for asynchronousl loading of 3rd party content by creating a same-domain iframe and injecting the javascript loading code into that iframe.
Changes including namespace change, removal of Meebo specific cfeatures such as environment based config, and tracking & timing functions.

Original Meebo Bar embed code
=============================

The Meebo Bar loads asynchronously by creating a same-domain iframe and injecting the javascript loading code into that iframe.
See the commented code for details, and watch the Velocity 2010 presentation for an overview of the Meebo Bar performance in general (http://www.youtube.com/watch?v=b7SUFLFu3HI)
Original Source at: https://github.com/meebo/embed-code
