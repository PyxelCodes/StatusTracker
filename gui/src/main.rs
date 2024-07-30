use gtk::{prelude::WidgetExt, Window, WindowType};

fn main() {
    let window = Window::new(WindowType::Toplevel);
    window.set_title("StatusTracker");
    window.set_default_size(350, 70);

    window.show_all();
}