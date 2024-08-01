use gtk::prelude::*;
use gtk::{Application, ApplicationWindow};

fn main() {
    let app = Application::builder()
        .application_id("org.statustracker.gui")
        .build();

    app.connect_activate(|app| {
        let win = ApplicationWindow::builder()
            .application(app)
            .default_width(1920)
            .default_height(1080)
            .title("Status Tracker")
            .build();

        let navbar = create_navbar();
        win.set_child(Some(&navbar));

        win.show_all();
    });

    app.run();
}

fn create_navbar() -> gtk::Box {
    let navbar = gtk::Box::new(gtk::Orientation::Horizontal, 1000);
    navbar.set_size_request(1920, 50);
    
    let home_button = gtk::Button::with_label("Home");
    let login_button = gtk::Button::with_label("Login");
    
    navbar.pack_start(&home_button, false, false, 10);
    navbar.pack_start(&login_button, false, false, 10);
    navbar.set_child_padding(&home_button, 20);

    let wrapper = gtk::Box::new(gtk::Orientation::Vertical, 0);
    wrapper.pack_start(&navbar, false, false, 0);
    //wrapper.set_size_request(1920, 250);
    wrapper
}